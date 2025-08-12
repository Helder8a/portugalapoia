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
                "Aislamiento Sostenible": {
                    info: { objetivo: "Utilizar materiales de aislamiento con bajo impacto ambiental y alta eficiencia.", exemplo: "Isolamento de paredes com aglomerado de cortiça expandida.", beneficios: "Melhoria do conforto térmico e acústico, e redução da fatura energética." },
                    solucoes_pt: [
                        {
                            nome: "Aglomerado de Cortiça Expandida (ICB)",
                            fabricante: "Amorim Isolamentos, Sofalca",
                            descricao: "Material 100% natural e português. Excelente isolante térmico e acústico, totalmente reciclável e com balanço de carbono negativo.",
                            aplicacao: "Isolamento de paredes (ETICS), coberturas e lajes.",
                            link: "https://www.amorimisolamentos.com/"
                        },
                        {
                            nome: "Lã Mineral (Lã de Rocha ou Lã de Vidro)",
                            fabricante: "Volcalis, Saint-Gobain (Isover), Knauf Insulation",
                            descricao: "Isolantes fabricados a partir de matérias-primas naturais (rocha basáltica ou areia) e recicladas. Ótimo desempenho térmico, acústico e de proteção contra incêndios.",
                            aplicacao: "Paredes duplas, divisórias, tetos falsos e coberturas.",
                            link: "https://www.volcalis.pt/"
                        },
                        {
                            nome: "Betão de Cânhamo (Hempcrete)",
                            fabricante: "Natura Materia, Cânhamor",
                            descricao: "Mistura de cânhamo, cal e água. Material leve, com bom isolamento térmico e acústico. Regula a humidade interior.",
                            aplicacao: "Paredes de enchimento não estruturais, isolamento de coberturas.",
                            link: "https://naturamateria.pt/"
                        },
                        {
                            nome: "Painéis de Palha",
                            fabricante: "Pinho&Palha",
                            descricao: "Painéis pré-fabricados de palha de trigo compactada. É um subproduto agrícola, renovável e biodegradável com excelentes propriedades de isolamento.",
                            aplicacao: "Construção de paredes exteriores e interiores em sistemas modulares.",
                            link: "https://www.pinhopalha.com/"
                        },
                        {
                            nome: "EPS (Poliestireno Expandido) com material reciclado",
                            fabricante: "Nudura by Constreco, Termolan",
                            descricao: "Blocos de EPS (esferovite) para sistemas ICF e ETICS. Leves, de fácil manuseamento e com excelente isolamento térmico. As versões mais sustentáveis incorporam material reciclado.",
                            aplicacao: "Cofragem perdida para paredes de betão, isolamento exterior (ETICS).",
                            link: "https://nudurabyconstreco.pt/"
                        },
                        {
                            nome: "Fibra de Madeira",
                            fabricante: "Steico, Gutex (distribuidores em Portugal)",
                            descricao: "Painéis isolantes rígidos ou flexíveis, feitos de fibras de madeira. Material renovável, com boa inércia térmica (protege do calor no verão) e regulador de humidade.",
                            aplicacao: "Isolamento de coberturas, paredes e pavimentos.",
                            link: "https://csustentavel.com/empresas/wood-habitat/"
                        }
                    ],
                    credits: { "Isolamento térmico de cortiça": 0.6, "Isolamento com lã mineral (conteúdo reciclado)": 0.4, "Isolamento com painéis de palha ou fibra de madeira": 0.5, "Uso de Betão de Cânhamo": 0.5 }
                },
                "Paneles y Estructura": {
                    info: { objetivo: "Empregar sistemas estruturais e de vedações com materiais renováveis ou reciclados.", exemplo: "Estrutura de um edifício em madeira lamelada colada (CLT).", beneficios: "Redução do tempo de construção, menor peso da estrutura e sequestro de carbono." },
                    solucoes_pt: [
                        {
                            nome: "Madeira Lamelada Colada (MLC) e CLT",
                            fabricante: "Grupo Casais, Green Heritage, Tisem",
                            descricao: "Painéis e vigas estruturais de madeira maciça. Permitem construções rápidas, a seco e com uma pegada de carbono muito reduzida.",
                            aplicacao: "Estruturas de edifícios (pilares, vigas, paredes, lajes, coberturas).",
                            link: "https://edificiossustentaveis.casais.pt/"
                        },
                        {
                            nome: "Tijolo Ecológico (BTC - Bloco de Terra Comprimida)",
                            fabricante: "Terrapalha, vários produtores artesanais",
                            descricao: "Produzido a partir de terra local, prensado e curado ao ar, sem necessidade de cozedura. Possui excelente inércia térmica.",
                            aplicacao: "Paredes de alvenaria, muros.",
                            link: "https://terrapalha.com/"
                        },
                        {
                            nome: "Bambu",
                            fabricante: "Bambuearth, diversos fornecedores",
                            descricao: "Material de rápido crescimento, renovável e versátil com alta resistência. Pode ser usado em pavimentos, revestimentos e até em elementos estruturais.",
                            aplicacao: "Pavimentos, painéis, mobiliário, estruturas leves.",
                            link: "https://bambuearth.com/"
                        },
                        {
                            nome: "Betão com Agregados Reciclados",
                            fabricante: "Secil, Cimpor, Betão Liz",
                            descricao: "Betão que substitui parte dos agregados naturais (areia, brita) por materiais provenientes de resíduos de construção e demolição (RCD), promovendo a economia circular.",
                            aplicacao: "Fundações, lajes, elementos não estruturais.",
                            link: "https://www.secil-group.com/pt/"
                        }
                    ],
                    credits: { "Utilização de Madeira Certificada (FSC/PEFC)": 0.6, "Estrutura em CLT ou madeira lamelada": 0.7, "Alvenaria com Tijolo Ecológico (BTC)": 0.4, "Uso de Betão com agregados reciclados": 0.3 }
                },
                "Revestimientos y Acabados": {
                    info: { objetivo: "Aplicar acabamentos interiores e exteriores que sejam saudáveis, naturais e de baixo impacto.", exemplo: "Reboco interior com argamassa de argila.", beneficios: "Melhoria da qualidade do ar interior, regulação natural da humidade e estética." },
                    solucoes_pt: [
                        {
                            nome: "Argamassas com Cortiça",
                            fabricante: "Secil (Reabilita Cal), Diasen",
                            descricao: "Argamassas e rebocos que incorporam granulado de cortiça, melhorando o desempenho térmico e acústico.",
                            aplicacao: "Rebocos de isolamento térmico (diatermico), regularização de pavimentos.",
                            link: "https://www.secil-group.com/pt/"
                        },
                        {
                            nome: "Revestimentos de Argila e Cal",
                            fabricante: "Terrapalha, EMERGE, Margaça",
                            descricao: "Revestimentos naturais que permitem que as paredes 'respirem', regulando a humidade e a temperatura. Não libertam compostos tóxicos.",
                            aplicacao: "Rebocos interiores e exteriores, pinturas.",
                            link: "https://terrapalha.com/"
                        },
                        {
                            nome: "Pavimento de Linóleo",
                            fabricante: "Forbo (Marmoleum), Tarkett",
                            descricao: "Pavimento resiliente feito de matérias-primas naturais como óleo de linhaça, resinas, farinha de madeira e juta. É durável, biodegradável e antibacteriano.",
                            aplicacao: "Pavimentos interiores em zonas de alto tráfego como escolas, hospitais e residências.",
                            link: "https://www.forbo.com/flooring/pt-pt/"
                        }
                    ],
                    credits: { "Rebocos com argamassas de cortiça": 0.4, "Uso de revestimentos de argila ou cal": 0.3, "Pavimentos de linóleo ou madeira certificada": 0.3, "Materiais de origem local (<100km)": 0.3 }
                }
            },
            "Cargas Ambientais": {
                "Gestão de Resíduos": {
                    info: { objetivo: "Minimização da produção de resíduos.", exemplo: "Plano de obra que desvie >70% dos resíduos para reciclagem.", beneficios: "Redução do lixo." },
                    credits: { "Plano de gestão de resíduos de construção (>70% desviado)": 0.6, "Espaço para separação de resíduos domésticos": 0.4 }
                }
            },
            "Qualidade do Ambiente Interior": {
                "Saúde e Qualidade do Ar": {
                    info: { objetivo: "Garantir um ambiente interior saudável e confortável, livre de emissões tóxicas.", exemplo: "Projetar ventilação natural e usar tintas sem COV.", beneficios: "Ambiente mais saudável e produtivo." },
                    solucoes_pt: [
                        {
                            nome: "Tintas e Vernizes Ecológicos",
                            fabricante: "CIN (gama CINatura), Robbialac (gama Ecolabel), Biofa",
                            descricao: "Tintas e vernizes à base de água ou óleos naturais, com emissões de Compostos Orgânicos Voláteis (COV) muito reduzidas ou nulas e certificadas com o Rótulo Ecológico Europeu (Ecolabel).",
                            aplicacao: "Pintura de paredes, tetos, madeiras e metais.",
                            link: "https://www.cin.com/"
                        },
                        {
                            nome: "Placas de Gesso com tecnologia ativ'Air®",
                            fabricante: "Saint-Gobain (Placo)",
                            descricao: "Placas de gesso que absorvem e neutralizam formaldeídos presentes no ar interior, melhorando ativamente a qualidade do ar ao longo do tempo.",
                            aplicacao: "Paredes divisórias, revestimentos de parede e tetos falsos.",
                            link: "https://www.saint-gobain.pt/"
                        }
                    ],
                    credits: { "Ventilação natural cruzada eficiente": 0.5, "Materiais com baixas emissões de COV (tintas, colas)": 0.4, "Placas de gesso com purificação de ar": 0.3 }
                }
            },
            "Vivências Socioeconómicas": {
                "Sistemas de Água e Energia": {
                    info: { objetivo: "Reduzir o consumo de água potável e de energia da rede pública.", exemplo: "Instalação de um sistema de captação de água da chuva para rega e descargas.", beneficios: "Poupança na fatura da água e energia, e menor pressão sobre os recursos públicos." },
                    solucoes_pt: [
                        {
                            nome: "Sistemas de Captação de Água da Chuva",
                            fabricante: "Graf, ACO, Sanitana",
                            descricao: "Sistemas compostos por filtros, depósitos (enterrados ou de superfície) e bombas para recolha e aproveitamento da água pluvial para fins não potáveis.",
                            aplicacao: "Rega de jardins, lavagem de pavimentos e carros, descargas de autoclismos.",
                            link: "https://www.graf.info/pt.html"
                        },
                        {
                            nome: "Torneiras e Autoclismos Eficientes",
                            fabricante: "Sanitana, Cinca, Roca (W+W)",
                            descricao: "Torneiras com redutores de caudal e autoclismos de dupla descarga (ou com sistemas de reutilização de água) que reduzem significativamente o consumo de água.",
                            aplicacao: "Instalações sanitárias em cozinhas e casas de banho.",
                            link: "https://www.sanitana.com/"
                        },
                        {
                            nome: "Telhados Verdes",
                            fabricante: "Landlab, ZinCo",
                            descricao: "Sistema de cobertura que permite o crescimento de vegetação. Melhora o isolamento, a gestão das águas pluviais, a biodiversidade e a qualidade do ar.",
                            aplicacao: "Coberturas planas ou com pouca inclinação.",
                            link: "https://www.landlab.pt/"
                        }
                    ],
                    credits: { "Sistema de aproveitamento de águas pluviais": 0.5, "Torneiras e autoclismos de baixo consumo": 0.3, "Instalação de telhado verde para gestão de águas": 0.4, "Instalação de painéis solares": 0.5 }
                },
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