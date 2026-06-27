// ==================== LÓGICA DA API DE FRASES MOTIVACIONAIS ====================
function atualizarFrase() {
    const elementoTexto = document.getElementById("textoFrase");
    
    elementoTexto.innerHTML = "<i>Buscando inspiração...</i>";

    // API de conselhos (Advice Slip)
    fetch("https://api.adviceslip.com/advice")
        .then(resposta => {
            if (!resposta.ok) throw new Error("Erro ao buscar conselho");
            return resposta.json();
        })
        .then(dados => {
            const fraseIngles = dados.slip.advice;

            // Tradução para Português
            return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(fraseIngles)}&langpair=en|pt-BR`);
        })
        .then(respostaTraducao => {
            if (!respostaTraducao.ok) throw new Error("Erro na tradução");
            return respostaTraducao.json();
        })
        .then(dadosTraduzidos => {
            const fraseTraduzida = dadosTraduzidos.responseData.translatedText || "Não foi possível traduzir a frase.";

            elementoTexto.innerHTML = `"${fraseTraduzida}" <strong>- Conselho do Dia</strong>`;
        })
        .catch(erro => {
            console.error("Falha ao buscar frase:", erro);
            elementoTexto.innerHTML = `
                "A persistência é o caminho do êxito." 
                <strong>- Charles Chaplin</strong>
            `;
        });
}