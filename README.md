# 📝 To-Do List 

Um aplicativo moderno de gerenciamento de tarefas (To-Do List) que evoluiu de um armazenamento local simples para uma arquitetura completa cliente-servidor com persistência de dados em nuvem.

---

## 🚀 Funcionalidades Atuais

- **Gerenciamento de Tarefas:** Adicione, conclua e remova tarefas com atualizações instantâneas na interface.
- **Persistência Total na Nuvem:** Todas as tarefas e marcações são salvas diretamente em um banco de dados relacional online, garantindo que os dados não sumam se o navegador for limpo.
- **Histórico Automático:** Ao deletar uma tarefa, ela é enviada para uma tabela de histórico contendo a data e o horário exato da ação.
- **Sincronização Multiplataforma:** Acesse sua lista de tarefas de qualquer dispositivo (celular, tablet ou computador) com os dados sincronizados em tempo real.
- **API de Motivação Integrada (Proxy):** Consome uma API internacional de conselhos e faz a tradução automática no servidor, exibindo frases motivacionais em português para o usuário a cada acesso.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
- **HTML5:** Estrutura semântica da aplicação.
- **CSS3:** Design responsivo, estilização moderna e animações.
- **JavaScript (ES6):** Manipulação dinâmica do DOM e consumo de APIs via `fetch`.

### **Back-end**
- **Python:** Linguagem principal do servidor.
- **Flask:** Micro-framework para criação das rotas da API REST.
- **Flask-CORS:** Gerenciamento de permissões de requisições externas.
- **Requests:** Integração e consumo de serviços de tradução externos.

### **Banco de Dados**
- **PostgreSQL:** Banco de dados relacional robusto.
- **Neon.tech:** Plataforma serverless de hospedagem do banco de dados na nuvem com servidores de baixa latência (região de São Paulo).

---

## 🧠 Aprendizados e Evolução do Projeto

O projeto foi originalmente concebido utilizando apenas `LocalStorage` (armazenamento local do navegador). Durante o desenvolvimento, a arquitetura foi completamente reestruturada para o modelo **Full-Stack**, trazendo conceitos práticos de:
1. Comunicação entre Front-end e Back-end (API REST).
2. Segurança e sanitização de dados com drivers SQL (`psycopg2-binary`).
3. Modelagem de dados relacionais na nuvem com criação automatizada de tabelas (`CREATE TABLE IF NOT EXISTS`).
4. Arquitetura unificada de microserviços e consumo de APIs de terceiros com tratamento de erros (fallback).

---

## 🔧 Como Rodar o Projeto Localmente

1. **Instale as dependências do Python:**
   ```bash
   pip install flask flask-cors psycopg2-binary requests

   ---

## 🔒 Práticas de Segurança Implementadas

Para garantir a integridade da aplicação e proteger os dados contra vulnerabilidades comuns da web, o back-end foi estruturado seguindo boas práticas de segurança de mercado:

1. **Proteção contra SQL Injection:** Utilização de consultas parametrizadas com placeholders (`%s`) através do driver `psycopg2`, garantindo que qualquer entrada do usuário seja tratada estritamente como dado, e nunca como comando executável.
2. **Isolamento de Credenciais (Environment Variables):** A URL de conexão com o banco de dados Neon é gerenciada via `os.environ.get('DATABASE_URL')`. Isso evita o vazamento acidental de senhas e chaves de acesso no histórico público do GitHub.
3. **Prevenção contra Estouro de Memória e Payload Gigante:** Validação rígida no Flask limitando o tamanho dos textos recebidos a um máximo de 255 caracteres (`VARCHAR(255)`). Isso impede tentativas de sobrecarga de armazenamento ou ataques de negação de serviço (DoS) no banco de dados gratuito.
4. **Resiliência e Gerenciamento de Timeouts:** Definição de limites estritos de tempo (`timeout=3`) nas requisições HTTP do Proxy de Frases, impedindo que lentidões nas APIs externas de tradução travem o servidor ou causem o esgotamento de threads.
5. **Configuração de Políticas de CORS:** Preparado para restringir requisições HTTP por meio do cabeçalho `Access-Control-Allow-Origin`, permitindo futuramente apenas o domínio oficial onde o front-end estará hospedado.
