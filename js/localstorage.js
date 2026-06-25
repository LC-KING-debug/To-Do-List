function salvarTarefas() {

    const tarefas = [];

    document.querySelectorAll("#listaTarefas li").forEach(li => {

        tarefas.push({
            texto: li.querySelector(".texto-tarefa").textContent,
            concluida: li.querySelector(".texto-tarefa").classList.contains("concluida")
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

    if (!tarefasSalvas) return [];

    return JSON.parse(tarefasSalvas);
}