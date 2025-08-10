const liderAData = {
    "Integração Local": {
        "Bio-clima": { weight: 0.8, info: "Otimização do projeto face às condições climáticas locais (sol, vento) para maximizar o conforto e minimizar o consumo de energia.", credits: { "Orientação solar otimizada": 0.4, "Proteção contra ventos dominantes": 0.2, "Estudo de sombras adequado": 0.2 } },
        "Geologia e Relevo": { weight: 0.6, info: "Adaptação do edifício à topografia e geologia do terreno, minimizando a movimentação de terras e o impacto na paisagem.", credits: { "Adaptação à topografia natural": 0.3, "Minimização da escavação": 0.3 } },
        "Água e Ecossistemas": { weight: 1.0, info: "Preservação e melhoria dos sistemas hídricos e da biodiversidade local.", credits: { "Proteção de linhas de água": 0.4, "Criação de habitats para fauna local": 0.3, "Uso de vegetação autóctone": 0.3 } }
    },
    "Recursos": {
        "Eficiência Energética": { weight: 1.5, info: "Redução do consumo de energia do edifício através de um bom isolamento, equipamentos eficientes e fontes renováveis.", credits: { "Isolamento térmico de alto desempenho (paredes e cobertura)": 0.5, "Janelas eficientes (vidros duplos/triplos com corte térmico)": 0.4, "Sistemas de climatização (AVAC) de alta eficiência": 0.3, "Iluminação LED de baixo consumo": 0.3 } },
        "Energias Renováveis": { weight: 1.2, info: "Produção de energia no local a partir de fontes renováveis para reduzir a dependência da rede elétrica.", credits: { "Painéis solares fotovoltaicos": 0.6, "Painéis solares térmicos para AQS": 0.4, "Bomba de calor geotérmica": 0.2 } },
        "Eficiência Hídrica": { weight: 1.2, info: "Redução do consumo de água potável através de equipamentos eficientes e reutilização de água.", credits: { "Torneiras e chuveiros de baixo fluxo": 0.4, "Sanitas de dupla descarga": 0.3, "Sistema de aproveitamento de águas pluviais": 0.5 } },
        "Materiais Sustentáveis": { weight: 1.0, info: "Seleção de materiais com baixo impacto ambiental, reciclados, recicláveis e de origem local.", credits: { "Uso de materiais reciclados (ex: aço, agregados)": 0.3, "Uso de materiais regionais (ex: cortiça, granito)": 0.4, "Madeira certificada (FSC/PEFC)": 0.3 } }
    },
    "Cargas Ambientais": {
        "Gestão de Resíduos": { weight: 1.0, info: "Minimização da produção de resíduos em fase de construção e operação, e promoção da reciclagem.", credits: { "Plano de gestão de resíduos de construção (>70% desviado de aterro)": 0.6, "Espaço dedicado para separação de resíduos domésticos": 0.4 } },
        "Emissões e Poluição": { weight: 0.8, info: "Redução das emissões poluentes para o ar, solo e água, e minimização da poluição sonora e luminosa.", credits: { "Uso de refrigerantes com baixo potencial de aquecimento global": 0.4, "Redução da poluição luminosa exterior": 0.4 } }
    },
    "Qualidade do Ambiente Interior": {
         "Conforto Térmico e Qualidade do Ar": { weight: 1.2, info: "Garantir um ambiente interior saudável e confortável através de uma boa ventilação e controlo da temperatura.", credits: { "Ventilação natural cruzada eficaz": 0.5, "Materiais de construção com baixas emissões de COV": 0.4, "Monitorização de CO2 nos espaços": 0.3 } },
         "Conforto Acústico e Visual": { weight: 0.8, info: "Proteção contra ruído exterior e interior, e otimização da iluminação natural e artificial.", credits: { "Bom isolamento acústico de fachadas e entre pisos": 0.4, "Acesso a luz natural na maioria dos espaços": 0.4 } }
    },
     "Vivências Socioeconómicas": {
        "Acessibilidades e Inclusão": { weight: 1.0, info: "Garantir que o edifício seja acessível e seguro para todos, incluindo pessoas com mobilidade reduzida.", credits: { "Acessos sem barreiras arquitetónicas": 0.6, "Instalações sanitárias adaptadas": 0.4 } },
        "Economia e Gestão": { weight: 0.9, info: "Análise do custo de ciclo de vida do edifício, considerando não só a construção mas também a operação e manutenção a longo prazo.", credits: { "Análise de custo de ciclo de vida": 0.5, "Manual de operação e manutenção para o utilizador": 0.4 } }
     }
};