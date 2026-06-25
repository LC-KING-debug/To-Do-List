window.onload = function () {

    carregarTarefas();

    verificarBotoes();

};

function adicionarTarefa() {

    const input = document.getElementById("tarefaInput");

    const texto = input.value.trim();

    if (texto === "") {

        alert("Digite uma tarefa!");

        return;

    }

    criarTarefa(texto);

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
        <span class="excluir">❌</span>
    `;

    const textoTarefa = li.querySelector(".texto-tarefa");

    const botaoConcluir = li.querySelector(".concluir");

    const botaoExcluir = li.querySelector(".excluir");

    if (concluida) {

        textoTarefa.classList.add("concluida");

    }

    botaoConcluir.addEventListener("click", () => {

        textoTarefa.classList.toggle("concluida");

        salvarTarefas();

    });

    botaoExcluir.addEventListener("click", () => {

        li.remove();

        salvarTarefas();

        verificarBotoes();

    });

    lista.appendChild(li);

}

function concluirTodas() {

    const tarefas =
        document.querySelectorAll(".texto-tarefa");

    tarefas.forEach(tarefa => {

        tarefa.classList.add("concluida");

    });

    salvarTarefas();

}

function excluirTudo() {

    const confirmar =
        confirm("Deseja excluir todas as tarefas?");

    if (!confirmar) return;

    const lista =
        document.getElementById("listaTarefas");

    lista.innerHTML = "";

    salvarTarefas();

    verificarBotoes();

}

function verificarBotoes() {

    const lista =
        document.getElementById("listaTarefas");

    const btnConcluir =
        document.getElementById("btnConcluirTodas");

    const btnExcluir =
        document.getElementById("btnExcluirTudo");

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

    document.querySelectorAll("#listaTarefas li")
        .forEach(li => {

            tarefas.push({

                texto:
                    li.querySelector(".texto-tarefa").textContent,

                concluida:
                    li.querySelector(".texto-tarefa")
                        .classList.contains("concluida")

            });

        });

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

}

function carregarTarefas() {

    const tarefasSalvas =
        localStorage.getItem("tarefas");

    if (!tarefasSalvas) return;

    const tarefas =
        JSON.parse(tarefasSalvas);

    tarefas.forEach(tarefa => {

        criarTarefa(
            tarefa.texto,
            tarefa.concluida
        );

    });

}