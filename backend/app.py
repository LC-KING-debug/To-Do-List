from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import requests
import os

app = Flask(__name__)


# ==================== SEGURANÇA: CONFIGURAÇÃO DE CORS ====================

CORS(app, origins="*") 



URL_DO_BANCO_NUVEM = os.environ.get(
    'DATABASE_URL', 
    'postgresql://neondb_owner:npg_qdE6tXp2CYHM@ep-old-bar-acazz2so.sa-east-1.aws.neon.tech/neondb?sslmode=require'
)

def conectar():
    return psycopg2.connect(URL_DO_BANCO_NUVEM)

def iniciar_banco():
    try:
        conexao = conectar()
        cursor = conexao.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tarefas (
                id SERIAL PRIMARY KEY,
                texto VARCHAR(255) NOT NULL, -- SEGURANÇA: Limitado o tipo TEXT para VARCHAR(255) no banco
                concluida BOOLEAN DEFAULT FALSE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS historico (
                id SERIAL PRIMARY KEY,
                texto VARCHAR(255) NOT NULL, -- SEGURANÇA: Evita abusos de tamanhos gigantescos no histórico
                concluida BOOLEAN DEFAULT FALSE,
                data VARCHAR(50) NOT NULL
            )
        ''')
        
        conexao.commit()
        cursor.close()
        conexao.close()
        print("\n=== BANCO DE DADOS NA NUVEM CONECTADO E PRONTO! ===")
    except Exception as e:
        print(f"\n--- ERRO CRÍTICO AO INICIAR BANCO NA NUVEM: {e} ---")

# ==================== ROTAS DE TAREFAS ====================

@app.route('/api/tarefas', methods=['GET'])
def listar_tarefas():
    try:
        conexao = conectar()
        cursor = conexao.cursor()
        cursor.execute("SELECT id, texto, concluida FROM tarefas ORDER BY id ASC")
        linhas = cursor.fetchall()
        cursor.close()
        conexao.close()
        
        tarefas = [{"id": l[0], "texto": l[1], "concluida": bool(l[2])} for l in linhas]
        return jsonify(tarefas), 200
    except Exception as e:
        return jsonify({"erro": "Erro interno ao processar listagem."}), 500

@app.route('/api/tarefas', methods=['POST'])
def adicionar_tarefa():
    try:
        dados = request.json or {}
        texto = dados.get('texto', '').strip()
        
        # 🛡️ VALIDAÇÃO DE SEGURANÇA 1: String Vazia
        if not texto:
            return jsonify({"erro": "O texto da tarefa nao pode estar vazio."}), 400
            
        # 🛡️ VALIDAÇÃO DE SEGURANÇA 2: Proteção contra estouro de memória
        if len(texto) > 255:
            return jsonify({"erro": "O texto da tarefa e longo demais (Max: 255 caracteres)."}), 400
            
        conexao = conectar()
        cursor = conexao.cursor()
        # Tratamento seguro contra SQL Injection mantido através do parâmetro (%s)
        cursor.execute("INSERT INTO tarefas (texto, concluida) VALUES (%s, FALSE) RETURNING id", (texto,))
        conexao.commit()
        novo_id = cursor.fetchone()[0]
        cursor.close()
        conexao.close()
        
        return jsonify({"id": novo_id, "texto": texto, "concluida": False}), 201
    except Exception as e:
        return jsonify({"erro": "Erro ao salvar tarefa no banco."}), 500

# ==================== ROTAS DE HISTÓRICO ====================

@app.route('/api/historico', methods=['GET'])
def obtener_historico():
    try:
        conexao = conectar()
        cursor = conexao.cursor()
        cursor.execute("SELECT texto, concluida, data FROM historico ORDER BY id DESC")
        linhas = cursor.fetchall()
        cursor.close()
        conexao.close()
        
        historico = [{"texto": l[0], "concluida": bool(l[1]), "data": l[2]} for l in linhas]
        return jsonify(historico), 200
    except Exception as e:
        return jsonify({"erro": "Erro interno ao processar historico."}), 500

@app.route('/api/historico', methods=['POST'])
def adicionar_historico():
    try:
        dados = request.json or {}
        texto = dados.get('texto', '').strip()
        concluida = bool(dados.get('concluida', False))
        data = dados.get('data', '').strip()
        
        # 🛡️ VALIDAÇÃO DE SEGURANÇA 3: Evitar dados gigantes no histórico
        if len(texto) > 255 or len(data) > 50:
            return jsonify({"erro": "Dados de entrada invalidos ou muito extensos."}), 400
        
        conexao = conectar()
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO historico (texto, concluida, data) VALUES (%s, %s, %s)", (texto, concluida, data))
        conexao.commit()
        cursor.close()
        conexao.close()
        
        return jsonify({"mensagem": "Adicionado ao historico na nuvem com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": "Erro ao salvar no historico."}), 500

# ==================== API DE FRASES (PROXY COM TIMEOUT) ====================

@app.route('/api/frase', methods=['GET'])
def obter_frase():
    try:
        # 🛡️ SEGURANÇA: Definido timeout curto de 3 segundos para prevenir travamento do servidor Flask
        resposta_advice = requests.get("https://api.adviceslip.com/advice", timeout=3)
        frase_ingles = resposta_advice.json()['slip']['advice']

        url_traducao = f"https://api.mymemory.translated.net/get?q={frase_ingles}&langpair=en|pt-BR"
        resposta_traducao = requests.get(url_traducao, timeout=3)
        frase_traduzida = resposta_traducao.json()['responseData']['translatedText']

        return jsonify({"frase": frase_traduzida, "autor": "Conselho do Dia"}), 200
    except Exception:
        # Fallback seguro caso as APIs caiam ou demorem para responder
        return jsonify({"frase": "A persistência é o caminho do êxito.", "autor": "Charles Chaplin (Backup)"}), 200

# ==================== INICIALIZAÇÃO DO SERVIDOR ====================

if __name__ == '__main__':
    iniciar_banco()
    app.run(debug=True, port=5000)