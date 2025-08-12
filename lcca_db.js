const lccaDB = {
    // Aislamiento
    "amorim_icb": {
        nome: "Aglomerado de Cortiça Expandida (ICB)",
        unidade: "m²",
        custo_inicial: 35, // Valor aproximado €/m² para 60mm de espessura
        custo_manutencao_anual: 0.001, // 0.1% do custo inicial
        vida_util: 50, // Anos
        custo_substituicao: 1.0, // 100% do custo inicial
        poupanca_energetica_anual: 4.5 // Valor aproximado €/m²/ano
    },
    "volcalis_lã": {
        nome: "Lã Mineral (Lã de Rocha)",
        unidade: "m²",
        custo_inicial: 22, // Valor aproximado €/m² para 60mm
        custo_manutencao_anual: 0.001,
        vida_util: 50,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 4.0
    },
    "hempcrete": {
        nome: "Betão de Cânhamo (Hempcrete)",
        unidade: "m³",
        custo_inicial: 250, // Valor aproximado €/m³ aplicado
        custo_manutencao_anual: 0.002,
        vida_util: 100,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 30 // Valor aproximado €/m³/ano
    },
    "painel_palha": {
        nome: "Painel de Palha Estrutural",
        unidade: "m²",
        custo_inicial: 90, // Valor aproximado €/m² de parede
        custo_manutencao_anual: 0.005,
        vida_util: 80,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 5.0
    },

    // Paneles y Estructura
    "madeira_clt": {
        nome: "Madeira Lamelada Colada (CLT)",
        unidade: "m³",
        custo_inicial: 700, // Valor aproximado €/m³
        custo_manutencao_anual: 0.01, // Requer tratamento/verniz periódico
        vida_util: 100,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 0 // Estrutural, poupança vem do isolamento associado
    },
    "tijolo_btc": {
        nome: "Tijolo Ecológico (BTC)",
        unidade: "unidade",
        custo_inicial: 0.8, // Valor aproximado por tijolo
        custo_manutencao_anual: 0.002,
        vida_util: 100,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 0.1 // Devido à inércia térmica
    },

    // Revestimientos y Acabados
    "argamassa_cortiça": {
        nome: "Argamassa com Cortiça",
        unidade: "m²",
        custo_inicial: 25, // Valor aproximado por m² aplicado
        custo_manutencao_anual: 0.001,
        vida_util: 40,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 1.5
    },
    "linoleo": {
        nome: "Pavimento de Linóleo",
        unidade: "m²",
        custo_inicial: 40, // Valor aproximado por m² instalado
        custo_manutencao_anual: 0.02, // Requer limpeza e polimento
        vida_util: 25,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 0
    },
    
    // Sistemas de Água e Energia
    "telhado_verde": {
        nome: "Telhado Verde Extensivo",
        unidade: "m²",
        custo_inicial: 80, // Valor aproximado por m²
        custo_manutencao_anual: 0.03, // Manutenção da vegetação
        vida_util: 40, // Vida útil da membrana e sistema
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 3.5 // Redução de custos de climatização
    },
    "paineis_solares": {
        nome: "Painéis Solares Fotovoltaicos",
        unidade: "kWp", // kilowatt-pico instalado
        custo_inicial: 1200, // Valor aproximado por kWp
        custo_manutencao_anual: 0.01,
        vida_util: 25,
        custo_substituicao: 0.8, // Custo tende a baixar
        poupanca_energetica_anual: 200 // Valor aproximado de poupança por kWp/ano
    },

    // Janelas
    "janela_eficiente": {
        nome: "Janela Eficiente (PVC, Vidro Duplo)",
        unidade: "m²",
        custo_inicial: 350, // Valor aproximado por m²
        custo_manutencao_anual: 0.005,
        vida_util: 40,
        custo_substituicao: 1.0,
        poupanca_energetica_anual: 8.0 // Poupança significativa em climatização
    }
};