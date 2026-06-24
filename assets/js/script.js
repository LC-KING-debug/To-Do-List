function verificarBotoes() {

    const lista = document.getElementById("listaTarefas");

    const btnConcluir = document.getElementById("btnConcluirTodas");
    const btnExcluir = document.getElementById("btnExcluirTudo");

    if(lista.children.length > 0){
        btnConcluir.style.display = "inline-block";
        btnExcluir.style.display = "inline-block";
    }else{
        btnConcluir.style.display = "none";
        btnExcluir.style.display = "none";
    }
}

function adicionarTarefa() {

    const input = document.getElementById("tarefaInput");
    const lista = document.getElementById("listaTarefas");

    const texto = input.value.trim();

    if(texto === ""){
        alert("Digite uma tarefa!");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span class="concluir">✅</span>
        <span class="texto-tarefa">${texto}</span>
        <span class="excluir">❌</span>
    `;

    lista.appendChild(li);

    input.value = "";

    const botaoConcluir = li.querySelector(".concluir");
    const botaoExcluir = li.querySelector(".excluir");
    const textoTarefa = li.querySelector(".texto-tarefa");

    botaoConcluir.addEventListener("click", () => {
        textoTarefa.classList.toggle("concluida");
    });

    botaoExcluir.addEventListener("click", () => {
        li.remove();
        verificarBotoes();
    });

    verificarBotoes();
}

function concluirTodas(){

    const tarefas =
        document.querySelectorAll(".texto-tarefa");

    tarefas.forEach(tarefa => {
        tarefa.classList.add("concluida");
    });
}

function excluirTudo(){

    const confirmar =
        confirm("Deseja excluir todas as tarefas?");

    if(confirmar){

        const lista =
            document.getElementById("listaTarefas");

        lista.innerHTML = "";

        verificarBotoes();
    }
}