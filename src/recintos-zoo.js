class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: ["macaco", "macaco", "macaco"] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: ["gazela"] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: ["leao"] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ["savana"] },
            LEOPARDO: { tamanho: 2, biomas: ["savana"] },
            CROCODILO: { tamanho: 3, biomas: ["rio"] },
            MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
            GAZELA: { tamanho: 2, biomas: ["savana"] },
            HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
        };
    }

    analisaRecintos(tipo, quantidade) {
        if (!this.animais[tipo.toUpperCase()]) {
            return { erro: "Animal inválido" };
        }
        if (typeof quantidade !== "number" || quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[tipo.toUpperCase()];
        const tamanhoTotalNecessario = animalInfo.tamanho * quantidade;
        const recintosViaveis = [];

        this.recintos.forEach(recinto => {
            const { numero, bioma, tamanho, animais } = recinto;

            // Teste Bioma
            if (!animalInfo.biomas.includes(bioma) && !(bioma === "savana e rio" && tipo.toUpperCase() === "HIPOPOTAMO")) {
                return;
            }

            let espacoOcupado = 0;
            let especiesExistentes = new Set();
            let carnivoroNoRecinto = false;
            let macacoNoRecinto = false;

            animais.forEach(animalExistente => {
                const infoExistente = this.animais[animalExistente.toUpperCase()];
                espacoOcupado += infoExistente.tamanho;
                especiesExistentes.add(animalExistente.toUpperCase());

                if (animalExistente.toUpperCase() === "MACACO") macacoNoRecinto = true;
                if (infoExistente.carnivoro) carnivoroNoRecinto = true;
            });

            if (animalInfo.carnivoro && carnivoroNoRecinto) {
                return;
            }

            if (tipo.toUpperCase() === "MACACO" && (animais.length === 0 && !macacoNoRecinto || macacoNoRecinto)) {
                return;
            }

            if (especiesExistentes.size > 0 && !especiesExistentes.has(tipo.toUpperCase())) {
                espacoOcupado += 1;
            }

            const espacoDisponivel = tamanho - espacoOcupado;
            if (espacoDisponivel >= tamanhoTotalNecessario) {
                recintosViaveis.push({
                    numero,
                    espacoLivre: espacoDisponivel - tamanhoTotalNecessario,
                    tamanhoTotal: tamanho
                });
            }
        });

        // Ordenação recintos viáveis
        recintosViaveis.sort((a, b) => {
            if (a.espacoLivre !== b.espacoLivre) {
                return b.espacoLivre - a.espacoLivre; // Maior espaço livre primeiro
            }
            return a.tamanhoTotal - b.tamanhoTotal; // Menor tamanho total em caso de empate
        });

        //output
        const recintosFormatados = recintosViaveis.map(recinto =>
            `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`
        );

        if (recintosFormatados.length > 0) {
            return { recintosViaveis: recintosFormatados };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };
