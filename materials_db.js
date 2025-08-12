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
                    info: {
                        objetivo: "Otimização do projeto face às condições climáticas locais.",
                        exemplo: "Edifício em Lisboa com fachadas de vidro a sul protegidas por palas.",
                        beneficios: "Redução da necessidade de ar condicionado.",
                        normativa_pt: {
                            nome: "REH - Regulamento de Desempenho Energético dos Edifícios de Habitação (Decreto-Lei n.º 101-D/2020)",
                            link: "https://dre.pt/dre/detalhe/decreto-lei/101-d-2020-150799381"
                        }
                    },
                    credits: { "Orientação solar otimizada": 0.4, "Proteção contra ventos dominantes": 0.2, "Estudo de sombras adequado": 0.2 }
                }
            },
            "Recursos": {
                "Aislamiento Sostenible": {
                    info: {
                        objetivo: "Utilizar materiales de aislamiento con bajo impacto ambiental y alta eficiencia.",
                        exemplo: "Isolamento de paredes com aglomerado de cortiça expandida.",
                        beneficios: "Melhoria do conforto térmico e acústico, e redução da fatura energética.",
                        normativa_pt: {
                            nome: "REH - Anexo III (Desempenho térmico de componentes da envolvente)",
                            link: "https://dre.pt/dre/detalhe/decreto-lei/101-d-2020-150799381"
                        }
                    },
                    solucoes_pt: [
                        {
                            nome: "Aglomerado de Cortiça Expandida (ICB)",
                            fabricante: "Amorim Isolamentos, Sofalca",
                            descricao: "Material 100% natural e português. Excelente isolante térmico e acústico, totalmente reciclável e com balanço de carbono negativo.",
                            aplicacao: "Isolamento de paredes (ETICS), coberturas e lajes.",
                            link: "https://www.amorimisolamentos.com/",
                            lcca_id: "amorim_icb",
                            kgCO2e: -1.5 // Negativo porque a cortiça sequestra carbono
                        },
                        {
                            nome: "Lã Mineral (Lã de Rocha)",
                            fabricante: "Volcalis, Saint-Gobain (Isover), Knauf Insulation",
                            descricao: "Isolantes fabricados a partir de matérias-primas naturais (rocha basáltica ou areia) e recicladas. Ótimo desempenho térmico, acústico e de proteção contra incêndios.",
                            aplicacao: "Paredes duplas, divisórias, tetos falsos e coberturas.",
                            link: "https://www.volcalis.pt/",
                            lcca_id: "volcalis_lã",
                            kgCO2e: 1.2 // kgCO2e por kg de produto
                        },
                        {
                            nome: "Betão de Cânhamo (Hempcrete)",
                            fabricante: "Natura Materia, Cânhamor",
                            descricao: "Mistura de cânhamo, cal e água. Material leve, com bom isolamento térmico e acústico. Regula a humidade interior.",
                            aplicacao: "Paredes de enchimento não estruturais, isolamento de coberturas.",
                            link: "https://naturamateria.pt/",
                            lcca_id: "hempcrete",
                            kgCO2e: -0.7 // Também sequestra carbono
                        },
                        {
                            nome: "Painéis de Palha",
                            fabricante: "Pinho&Palha",
                            descricao: "Painéis pré-fabricados de palha de trigo compactada. É um subproduto agrícola, renovável e biodegradável com excelentes propriedades de isolamento.",
                            aplicacao: "Construção de paredes exteriores e interiores em sistemas modulares.",
                            link: "https://www.pinhopalha.com/",
                            lcca_id: "painel_palha",
                            kgCO2e: -1.0 // Sequestra carbono
                        }
                    ],
                    credits: { "Isolamento térmico de cortiça": 0.6, "Isolamento com lã mineral (conteúdo reciclado)": 0.4, "Isolamento com painéis de palha ou fibra de madeira": 0.5, "Uso de Betão de Cânhamo": 0.5 }
                },
                "Paneles y Estructura": {
                    info: {
                        objetivo: "Empregar sistemas estruturais e de vedações com materiais renováveis ou reciclados.",
                        exemplo: "Estrutura de um edifício em madeira lamelada colada (CLT).",
                        beneficios: "Redução do tempo de construção, menor peso da estrutura e sequestro de carbono.",
                        normativa_pt: {
                            nome: "Eurocódigos Estruturais (ex: Eurocódigo 5 para madeira)",
                            link: "http://www.lnec.pt/pt/atividades/normalizacao/eurocodigos-estruturais/"
                        }
                    },
                    solucoes_pt: [
                        {
                            nome: "Madeira Lamelada Colada (CLT)",
                            fabricante: "Grupo Casais, Green Heritage, Tisem",
                            descricao: "Painéis e vigas estruturais de madeira maciça. Permitem construções rápidas, a seco e com uma pegada de carbono muito reduzida.",
                            aplicacao: "Estruturas de edifícios (pilares, vigas, paredes, lajes, coberturas).",
                            link: "https://edificiossustentaveis.casais.pt/",
                            lcca_id: "madeira_clt",
                            kgCO2e: -1.8 // Sequestra muito carbono
                        },
                        {
                            nome: "Tijolo Ecológico (BTC)",
                            fabricante: "Terrapalha, vários produtores artesanais",
                            descricao: "Produzido a partir de terra local, prensado e curado ao ar, sem necessidade de cozedura. Possui excelente inércia térmica.",
                            aplicacao: "Paredes de alvenaria, muros.",
                            link: "https://terrapalha.com/",
                            lcca_id: "tijolo_btc",
                            kgCO2e: 0.1 // Muito baixo impacto
                        },
                        {
                            nome: "Betão com Agregados Reciclados",
                            fabricante: "Secil, Cimpor, Betão Liz",
                            descricao: "Betão que substitui parte dos agregados naturais (areia, brita) por materiais provenientes de resíduos de construção e demolição (RCD), promovendo a economia circular.",
                            aplicacao: "Fundações, lajes, elementos não estruturais.",
                            link: "https://www.secil-group.com/pt/",
                            kgCO2e: 0.12 // kgCO2e por kg (ligeiramente menor que o tradicional)
                        }
                    ],
                    credits: { "Utilização de Madeira Certificada (FSC/PEFC)": 0.6, "Estrutura em CLT ou madeira lamelada": 0.7, "Alvenaria com Tijolo Ecológico (BTC)": 0.4, "Uso de Betão com agregados reciclados": 0.3 }
                }
            },
            "Cargas Ambientais": {
                "Gestão de Resíduos": {
                    info: {
                        objetivo: "Minimização da produção de resíduos.",
                        exemplo: "Plano de obra que desvie >70% dos resíduos para reciclagem.",
                        beneficios: "Redução do lixo.",
                        normativa_pt: {
                            nome: "RGGR - Regime Geral da Gestão de Resíduos (Decreto-Lei n.º 102-D/2020)",
                            link: "https://dre.pt/dre/detalhe/decreto-lei/102-d-2020-151049581"
                        }
                    },
                    credits: { "Plano de gestão de resíduos de construção (>70% desviado)": 0.6, "Espaço para separação de resíduos domésticos": 0.4 }
                }
            },
            "Qualidade do Ambiente Interior": {
                "Saúde e Qualidade do Ar": {
                    info: {
                        objetivo: "Garantir um ambiente interior saudável e confortável, livre de emissões tóxicas.",
                        exemplo: "Projetar ventilação natural e usar tintas sem COV.",
                        beneficios: "Ambiente mais saudável e produtivo.",
                        normativa_pt: {
                            nome: "RECS - Regulamento de Edifícios de Comércio e Serviços (parte do REH)",
                            link: "https://dre.pt/dre/detalhe/decreto-lei/101-d-2020-150799381"
                        }
                    },
                    solucoes_pt: [
                        {
                            nome: "Tintas e Vernizes Ecológicos",
                            fabricante: "CIN (gama CINatura), Robbialac (gama Ecolabel), Biofa",
                            descricao: "Tintas e vernizes à base de água ou óleos naturais, com emissões de Compostos Orgânicos Voláteis (COV) muito reduzidas ou nulas e certificadas com o Rótulo Ecológico Europeu (Ecolabel).",
                            aplicacao: "Pintura de paredes, tetos, madeiras e metais.",
                            link: "https://www.cin.com/",
                            kgCO2e: 1.5 // Varia muito, mas é um valor de referência
                        }
                    ],
                    credits: { "Ventilação natural cruzada eficiente": 0.5, "Materiais com baixas emissões de COV (tintas, colas)": 0.4, "Placas de gesso com purificação de ar": 0.3 }
                }
            }
        }
    },
    breeam: { name: "BREEAM", maxScore: 100, scoreUnit: "Pontos", levels: { 85: "Outstanding", 70: "Excellent", 55: "Very Good", 45: "Good", 30: "Pass", 0: "Unclassified" }, data: {} },
    leed: { name: "LEED", maxScore: 110, scoreUnit: "Pontos", levels: { 80: "Platinum", 60: "Gold", 50: "Silver", 40: "Certified", 0: "Uncertified" }, data: {} }
};