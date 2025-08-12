const certificationsDB = {
    lidera: {
        name: "LiderA", maxScore: 20.0, scoreUnit: "Pontos",
        levels: { 11: "A++", 9.5: "A+", 8.0: "A", 6.5: "B", 5.0: "C", 3.5: "D", 2.0: "E", 1.0: "F", 0: "G" },
        weights: {
            edificio: { "Integração Local": 1, "Recursos": 1.5, "Cargas Ambientais": 1, "Qualidade do Ambiente Interior": 1.2, "Vivências Socioeconómicas": 1 },
            urbano: { "Integração Local": 1.5, "Recursos": 1, "Cargas Ambientais": 1.2, "Qualidade do Ambiente Interior": 0.8, "Vivências Socioeconómicas": 1.5 }
        },
        data: {
            "Integração Local": {
                "Bio-clima": {
                    info: { objetivo: "Otimização do projeto face às condições climáticas locais.", exemplo: "Edifício em Lisboa com fachadas de vidro a sul protegidas por palas.", beneficios: "Redução da necessidade de ar condicionado." },
                    credits: { "Orientação solar otimizada": 0.4, "Proteção contra ventos dominantes": 0.2, "Estudo de sombras adequado": 0.2 }
                }
            },
            "Recursos": {
                "Eficiência Energética": {
                    info: { objetivo: "Redução do consumo de energia do edifício.", exemplo: "Utilização de isolamento de cortiça e janelas de vidro duplo.", beneficios: "Contas de energia mais baixas." },
                    solucoes_pt: [
                        {
                            nome: "Aglomerado de Cortiça Expandida (ICB)",
                            fabricante: "Amorim Isolamentos",
                            descricao: "Material 100% natural e português, proveniente da cortiça. É um excelente isolante térmico e acústico, totalmente reciclável e com um balanço de carbono negativo.",
                            aplicacao: "Isolamento de paredes exteriores (ETICS/Cappotto), coberturas planas e inclinadas, e lajes.",
                            link: "https://www.amorimisolamentos.com/"
                        },
                        {
                            nome: "Janelas de Alta Eficiência Energética",
                            fabricante: "Caixiave / Sosoares (Exemplos)",
                            descricao: "Caixilharia com corte térmico (PVC ou Alumínio) e vidro duplo ou triplo com baixo teor emissivo (low-e). Reduzem significativamente as perdas de calor no inverno e os ganhos no verão.",
                            aplicacao: "Vãos exteriores em geral (janelas, portas de sacada).",
                            link: "https://www.caixiave.pt/"
                        },
                        {
                            nome: "Lã Mineral (Lã de Rocha ou Lã de Vidro)",
                            fabricante: "Volcalis / Saint-Gobain (Exemplos)",
                            descricao: "Isolantes fabricados a partir de matérias-primas naturais (rocha basáltica ou areia). Oferecem excelente desempenho térmico, acústico e de proteção contra incêndios.",
                            aplicacao: "Paredes duplas, divisórias interiores, tetos falsos e coberturas.",
                            link: "https://www.volcalis.pt/"
                        }
                    ],
                    credits: { "Isolamento térmico de alto desempenho": 0.5, "Janelas eficientes com corte térmico": 0.4, "Sistemas AVAC de alta eficiência": 0.3, "Iluminação LED": 0.3 }
                },
                "Materiais de Baixo Impacto": {
                    info: { objetivo: "Utilização de materiais com menor impacto ambiental.", exemplo: "Uso de madeira certificada (FSC/PEFC) e tintas ecológicas.", beneficios: "Redução da pegada de carbono do edifício." },
                    solucoes_pt: [
                        {
                            nome: "Bambu",
                            fabricante: "Diversos fornecedores",
                            descricao: "Material de rápido crescimento, renovável e versátil. Pode ser usado em pavimentos, revestimentos e até em elementos estruturais.",
                            aplicacao: "Pavimentos, painéis de revestimento, mobiliário.",
                            link: "https://www.google.com/search?q=comprar+bambu+para+construção+portugal"
                        },
                        {
                            nome: "Betão de Cânhamo (Hempcrete)",
                            fabricante: "Natura Materia",
                            descricao: "Mistura de cânhamo, cal e água, que resulta num material leve, com bom isolamento térmico e acústico. É um material que 'respira', regulando a humidade interior.",
                            aplicacao: "Paredes de enchimento, isolamento de coberturas e lajes.",
                            link: "https://naturamateria.pt/"
                        },
                        {
                            nome: "Tijolo Ecológico (BTC - Bloco de Terra Comprimida)",
                            fabricante: "Vários produtores artesanais e industriais",
                            descricao: "Produzido a partir de terra local, prensado e curado ao ar, sem necessidade de cozedura, o que economiza energia. Possui excelente inércia térmica.",
                            aplicacao: "Paredes de alvenaria, muros.",
                            link: "https://www.google.com/search?q=tijolo+ecológico+portugal"
                        },
                        {
                            nome: "Painéis de Palha",
                            fabricante: "Pinho&Palha",
                            descricao: "Painéis pré-fabricados de palha de trigo compactada, com excelentes propriedades de isolamento. É um subproduto agrícola, renovável e biodegradável.",
                            aplicacao: "Construção de paredes exteriores e interiores em sistemas modulares.",
                            link: "https://www.pinhopalha.com/"
                        },
                        {
                            nome: "Argamassas com Cortiça",
                            fabricante: "Secil",
                            descricao: "Argamassas e betões leves que incorporam granulado de cortiça reciclada, melhorando o desempenho térmico e acústico e reduzindo o peso da estrutura.",
                            aplicacao: "Rebocos de isolamento térmico, enchimento de lajes.",
                            link: "https://www.secil-group.com/pt/inovacao/construcao-sustentavel.html"
                        },
                        {
                            nome: "Madeira Lamelada Colada (CLT - Cross Laminated Timber)",
                            fabricante: "Grupo Casais / Green Heritage",
                            descricao: "Painéis estruturais de madeira maciça, compostos por camadas de tábuas coladas e prensadas em direções alternadas. Permite construções rápidas, a seco e com uma pegada de carbono muito reduzida.",
                            aplicacao: "Estruturas de edifícios (paredes, lajes, coberturas).",
                            link: "https://edificiossustentaveis.casais.pt/"
                        }
                    ],
                    credits: { "Utilização de Madeira Certificada (FSC/PEFC)": 0.6, "Uso de materiais reciclados (>20%)": 0.4, "Materiais de origem local (<100km)": 0.3, "Revestimentos ecológicos (argila, cal)": 0.2 }
                }
            },
            "Cargas Ambientais": {
                "Gestão de Resíduos": {
                    info: { objetivo: "Minimização da produção de resíduos.", exemplo: "Plano de obra que desvie >70% dos resíduos para reciclagem.", beneficios: "Redução do lixo." },
                    credits: { "Plano de gestão de resíduos de construção (>70% desviado)": 0.6, "Espaço para separação de resíduos domésticos": 0.4 }
                }
            },
            "Qualidade do Ambiente Interior": {
                "Conforto Térmico e Qualidade do Ar": {
                    info: { objetivo: "Garantir um ambiente interior saudável e confortável.", exemplo: "Projetar ventilação natural e usar tintas sem COV.", beneficios: "Ambiente mais saudável." },
                    solucoes_pt: [
                        {
                            nome: "Tintas Ecológicas com Baixo COV",
                            fabricante: "CIN / Robbialac (Exemplos)",
                            descricao: "Tintas à base de água com emissões de Compostos Orgânicos Voláteis (COV) muito reduzidas ou nulas. Melhoram a qualidade do ar interior e são mais seguras para a saúde.",
                            aplicacao: "Pintura de paredes e tetos interiores.",
                            link: "https://www.cin.com/"
                        }
                    ],
                    credits: { "Ventilação natural cruzada": 0.5, "Materiais com baixas emissões de COV": 0.4, "Monitorização de CO2": 0.3 }
                }
            },
            "Vivências Socioeconómicas": {
                "Acessibilidades e Inclusão": {
                    info: { objetivo: "Garantir que o edifício seja acessível a todos.", exemplo: "Construir rampas de acesso e instalar elevadores adequados.", beneficios: "Inclusão social." },
                    credits: { "Acessos sem barreiras arquitetónicas": 0.6, "Instalações sanitárias adaptadas": 0.4 }
                }
            }
        }
    },
    breeam: { name: "BREEAM", maxScore: 100, scoreUnit: "Pontos", levels: { 85: "Outstanding", 70: "Excellent", 55: "Very Good", 45: "Good", 30: "Pass", 0: "Unclassified" }, data: {} },
    leed: { name: "LEED", maxScore: 110, scoreUnit: "Pontos", levels: { 80: "Platinum", 60: "Gold", 50: "Silver", 40: "Certified", 0: "Uncertified" }, data: {} }
};