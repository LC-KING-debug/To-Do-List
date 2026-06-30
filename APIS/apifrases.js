// ==================== LÓGICA DA API DE FRASES MOTIVACIONAIS ====================
function atualizarFrase() {
    const elementoTexto = document.getElementById("textoFrase");
    
    if (!elementoTexto) return; // Evita erros caso o elemento não exista na tela

    elementoTexto.innerHTML = "<i>Buscando inspiração...</i>";

    // CORREÇÃO: URL oficial da API de conselhos (Advice Slip)
    fetch("https://api.adviceslip.com/advice")
        .then(resposta => {
            if (!resposta.ok) throw new Error("Erro ao buscar conselho da API");
            return resposta.json();
        })
        .then(dados => {
            // Agora 'dados.slip.advice' existe de verdade!
            const fraseIngles = dados.slip.advice;

            // Envia para a API de tradução (MyMemory)
            return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(fraseIngles)}&langpair=en|pt-BR`);
        })
        .then(respostaTraducao => {
            if (!respostaTraducao.ok) throw new Error("Erro na ponte de tradução");
            return respostaTraducao.json();
        })
        .then(dadosTraduzidos => {
            let fraseTraduzida = dadosTraduzidos.responseData.translatedText || "Não foi possível traduzir a frase.";
            
            // Decodifica possíveis entidades HTML (como &quot; ou &#39;) que a API de tradução costuma injetar
            const parser = new DOMParser();
            const textoLimpo = parser.parseFromString(fraseTraduzida, 'text/html').body.textContent;

            elementoTexto.innerHTML = `"${textoLimpo}" <strong>- Conselho do Dia</strong>`;
        })
        .catch(erro => {
            console.error("Falha ao carregar a frase dinâmica:", erro);
            // Frase de segurança caso o usuário esteja sem internet ou as APIs caiam
            elementoTexto.innerHTML = `
                "A persistência é o caminho do êxito." 
                <strong>- Charles Chaplin</strong>
            `;
        });
}