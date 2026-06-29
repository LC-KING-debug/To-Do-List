const API_TAREFAS   = "https://todolist-api-backend.onrender.com/api/tarefas";
const API_HISTORICO = "https://todolist-api-backend.onrender.com/api/historico";
const API_FRASE     = "https://todolist-api-backend.onrender.com/api/frase";


let tarefasExcluidas = [];

// ==================== INICIALIZAÇÃO ====================
window.onload = function () {
    carregarTarefas();
    carregarHistorico();
    verificarBotoes();
    atualizarRelogio();
    atualizarFrase(); // <-- Executa a função do arquivo APIS/apifrases.js
    trocarAba('inicio');
};

// ==================== ÁUDIOS (Caminhos Corrigidos para o Render) ====================
const somAdicionar       = new Audio("/assets/sounds/adicionar.mp3");
const somConcluir        = new Audio("/assets/sounds/concluir.mp3");
const somExcluir         = new Audio("/assets/sounds/lixeira1.mp3");
const somExcluirTudo     = new Audio("/assets/sounds/excluirtudo.mp3");
const somConcluirTudo    = new Audio("/assets/sounds/concluirtodos.mp3");  
const somExcluirHistorico = new Audio("/assets/sounds/apagarhistorico.mp3");
const somTrocadeAba      = new Audio("/assets/sounds/trocadeaba.mp3");

somAdicionar.volume = 0.7;
somConcluir.volume = 0.7;
somExcluir.volume = 0.8;
somExcluirTudo.volume = 0.8;
somConcluirTudo.volume = 0.85;
somExcluirHistorico.volume = 0.9;
somTrocadeAba.volume = 0.6;

// ==================== TROCA DE ABAS ====================
function trocarAba(aba) {
    document.getElementById('abaInicio').style.display = aba === 'inicio' ? 'block' : 'none';
    document.getElementById('abaHistorico').style.display = aba === 'historico' ? 'block' : 'none';

    document.getElementById('btnInicio').classList.toggle('active', aba === 'inicio');
    document.getElementById('btnHistorico').classList.toggle('active', aba === 'historico');

    // Som da troca de abas
    somTrocadeAba.currentTime = 0;
    somTrocadeAba.play().catch(() => {});
}

document.getElementById('btnInicio').addEventListener('click', () => trocarAba('inicio'));
document.getElementById('btnHistorico').addEventListener('click', () => {
    trocarAba('historico');
    carregarHistorico();
});

// ==================== TAREFAS ====================
function adicionarTarefa() {
    const input = document.getElementById("tarefaInput");
    const texto = input.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        return;
    }

    criarTarefa(texto);

    somAdicionar.currentTime = 0;
    somAdicionar.play().catch(() => {}); 

    input.value = "";
    salvarTarefas();
    verificarBotoes();
}

function criarTarefa(texto, concluida = false) {
    const lista = document.getElementById("listaTarefas");
    const li = document.createElement("li");

    li.innerHTML = `
        <span class="concluir">✅</span>
        <span class="texto-tarefa">${texto}</span>
        <span class="excluir">🗑️</span>
    `;

    const textoTarefa = li.querySelector(".texto-tarefa");
    const botaoConcluir = li.querySelector(".concluir");
    const botaoExcluir = li.querySelector(".excluir");

    if (concluida) {
        textoTarefa.classList.add("concluida");
    }

    // Concluir tarefa
    botaoConcluir.addEventListener("click", () => {
        textoTarefa.classList.toggle("concluida");
        somConcluir.currentTime = 0;
        somConcluir.play().catch(() => {});
        salvarTarefas();
    });

    // Excluir tarefa
    botaoExcluir.addEventListener("click", () => {
        li.classList.add("excluindo");

        setTimeout(() => {
            const textoConteudo = li.querySelector(".texto-tarefa").textContent;
            const estavaConcluida = li.querySelector(".texto-tarefa").classList.contains("concluida");

            // Salva no histórico
            tarefasExcluidas.unshift({
                texto: textoConteudo,
                concluida: estavaConcluida,
                data: new Date().toLocaleString()
            });

            li.remove();
            salvarTarefas();
            salvarHistorico();
            verificarBotoes();

            somExcluir.currentTime = 0;
            somExcluir.play().catch(() => {});
        }, 400);
    });

    lista.appendChild(li);
}

function concluirTodas() {
    document.querySelectorAll("#listaTarefas .texto-tarefa").forEach(tarefa => {
        tarefa.classList.add("concluida");
    });

    somConcluirTudo.currentTime = 0;
    somConcluirTudo.play().catch(() => {});
    salvarTarefas();
}

function excluirTudo() {
    if (!confirm("Deseja excluir todas as tarefas?")) return;

    const lista = document.getElementById("listaTarefas");
    const tarefas = Array.from(lista.querySelectorAll("li"));

    tarefas.forEach(li => {
        const texto = li.querySelector(".texto-tarefa").textContent;
        const concluida = li.querySelector(".texto-tarefa").classList.contains("concluida");
        
        tarefasExcluidas.unshift({
            texto,
            concluida,
            data: new Date().toLocaleString()
        });
        li.classList.add("excluindo");
    });

    setTimeout(() => {
        lista.innerHTML = "";
        salvarTarefas();
        salvarHistorico();
        verificarBotoes();

        somExcluirTudo.currentTime = 0;
        somExcluirTudo.play().catch(() => {});
    }, 400);
}

// ==================== HISTÓRICO ====================
function salvarHistorico() {
    localStorage.setItem("tarefasExcluidas", JSON.stringify(tarefasExcluidas));
}

function carregarHistorico() {
    const salvo = localStorage.getItem("tarefasExcluidas");
    if (salvo) tarefasExcluidas = JSON.parse(salvo);

    const lista = document.getElementById("listaHistorico");
    lista.innerHTML = "";

    tarefasExcluidas.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.texto}</span>
            <small>${item.data}</small>
        `;
        lista.appendChild(li);
    });
}

function limparHistorico() {
    if (!confirm("Tem certeza que quer limpar todo o histórico?")) return;
    
    // Toca o som de limpar o histórico antes de zerar a lista
    somExcluirHistorico.currentTime = 0;
    somExcluirHistorico.play().catch(() => {});

    tarefasExcluidas = [];
    salvarHistorico();
    carregarHistorico();
}

// ==================== AUXILIARES ====================
function verificarBotoes() {
    const lista = document.getElementById("listaTarefas");
    const temTarefas = lista.children.length > 0;

    document.getElementById("btnConcluirTodas").style.display = temTarefas ? "inline-block" : "none";
    document.getElementById("btnExcluirTudo").style.display = temTarefas ? "inline-block" : "none";
}

function salvarTarefas() {
    const tarefas = [];
    document.querySelectorAll("#listaTarefas li").forEach(li => {
        tarefas.push({
            texto: li.querySelector(".texto-tarefa").textContent,
            concluida: li.querySelector(".texto-tarefa").classList.contains("concluida")
        });
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return;

    JSON.parse(tarefasSalvas).forEach(tarefa => {
        criarTarefa(tarefa.texto, tarefa.concluida);
    });
}

// ==================== RELÓGIO ====================
function atualizarRelogio() {
    const agora = new Date();
    let horas = String(agora.getHours()).padStart(2, "0");
    let minutos = String(agora.getMinutes()).padStart(2, "0");
    let periodo = (horas >= 18 || horas < 6) ? "DN" : "DT";

    document.getElementById("relogio").textContent = `${horas}:${minutos} ${periodo}`;
}

setInterval(atualizarRelogio, 1000);