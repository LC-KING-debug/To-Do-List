window.onload = function () {
    carregarTarefas();
    verificarBotoes();
};

// ==================== ÁUDIOS ====================
const somAdicionar     = new Audio("assets/sounds/adicionar.mp3");
const somConcluir      = new Audio("assets/sounds/concluir.mp3");
const somExcluir       = new Audio("assets/sounds/lixeira1.mp3");
const somExcluirTudo   = new Audio("assets/sounds/excluirtudo.mp3");
const somConcluirTudo  = new Audio("assets/sounds/concluirtodos.mp3");  

// Ajuste de volume (pode mudar depois)
somAdicionar.volume = 0.7;
somConcluir.volume = 0.7;
somExcluir.volume = 0.8;
somExcluirTudo.volume = 0.8;
somConcluirTudo.volume = 0.85;

function adicionarTarefa() {
    const input = document.getElementById("tarefaInput");
    const texto = input.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa!");
        return;
    }

    criarTarefa(texto);

    somAdicionar.currentTime = 0;
    somAdicionar.play();

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

    botaoConcluir.addEventListener("click", () => {
        textoTarefa.classList.toggle("concluida");
        
        somConcluir.currentTime = 0;
        somConcluir.play();

        salvarTarefas();
    });

    botaoExcluir.addEventListener("click", () => {
        li.classList.add("excluindo");

        setTimeout(() => {
            li.remove();
            
            somExcluir.currentTime = 0;
            somExcluir.play();

            salvarTarefas();
            verificarBotoes();
        }, 400);
    });

    lista.appendChild(li);
}

function concluirTodas() {
    const tarefas = document.querySelectorAll(".texto-tarefa");
    
    tarefas.forEach(tarefa => {
        tarefa.classList.add("concluida");
    });

  //Som específico para concluir tudo
    somConcluirTudo.currentTime = 0;
    somConcluirTudo.play();

    salvarTarefas();
}

function excluirTudo() {
    const confirmar = confirm("Deseja excluir todas as tarefas?");

    if (!confirmar) return;

    const lista = document.getElementById("listaTarefas");
    const tarefas = lista.querySelectorAll("li");

    tarefas.forEach(li => {
        li.classList.add("excluindo");
    });

    setTimeout(() => {
        lista.innerHTML = "";
        
        somExcluirTudo.currentTime = 0;
        somExcluirTudo.play();

        salvarTarefas();
        verificarBotoes();
    }, 400);
}

function verificarBotoes() {
    const lista = document.getElementById("listaTarefas");
    const btnConcluir = document.getElementById("btnConcluirTodas");
    const btnExcluir = document.getElementById("btnExcluirTudo");

    if (lista.children.length > 0) {
        btnConcluir.style.display = "inline-block";
        btnExcluir.style.display = "inline-block";
    } else {
        btnConcluir.style.display = "none";
        btnExcluir.style.display = "none";
    }
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

    const tarefas = JSON.parse(tarefasSalvas);

    tarefas.forEach(tarefa => {
        criarTarefa(tarefa.texto, tarefa.concluida);
    });
}

function atualizarRelogio() {

    const agora = new Date();

    let horas = agora.getHours();
    let minutos = agora.getMinutes();

    horas = String(horas).padStart(2, "0");
    minutos = String(minutos).padStart(2, "0");

    let periodo = horas >= 18 || horas < 6 ? "DN" : "DT";

    document.getElementById("relogio").textContent =
        `${horas}:${minutos} ${periodo}`;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);