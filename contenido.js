// =================================================================
// ARCHIVO CENTRAL DE CONTENIDO PARA PORTUGALAPOIA.COM (Versión Corregida)
// Rutas de imágenes corregidas para enlazar correctamente.
// =================================================================

const TODO_EL_CONTENIDO = {
  "configuracion": {
    "logo_url": "images/favicon.ico.png",
    "instagram_url": "https://www.instagram.com/portugalapoia",
    "footer_info_1": "© 2025 PortugalApoia.com - Todos os direitos reservados. | <a href='politica-privacidade.html' style='color: white;'>Política de Privacidade</a>",
    "footer_info_2": "Um projeto da <a href='mailto:fidessuc@gmail.com'>Fundación Fides</a>. Design by <a href='mailto:hbo.consulting.pt@gmail.com'>HBO Consulting</a>."
  },
  "anuncios": {
    "doacoes": [
      {
        "id": 1,
        "titulo": "Roupas de Inverno",
        "descripcion": "Estamos a recolher casacos, camisolas e mantas para distribuir por pessoas em situação de sem-abrigo na cidade do Porto. Qualquer ajuda é bem-vinda.",
        "tipo_item": "Roupa",
        "ciudad": "Porto",
        "contacto_email": "ajuda.porto@email.com"
      }
    ],
    "emprego": [
      { "id": 101, "titulo": "Ajudante Familiar", "descripcion": "Ajudante Familiar para Serviço Interno na zona de Cascais.", "imagen_url": "img_servicos_personales/limpeza.png", "ciudad": "Lisboa", "contacto": "Tel. <a href='tel:+351919110464'>919 110 464</a>", "fecha_publicacion": "2025-07-28" },
      { "id": 102, "titulo": "Limpieza Depois da Obra", "descripcion": "Mulheres na Obra Demolicao.", "imagen_url": "img_servicos_personales/limpeza.png", "ciudad": "Lisboa", "contacto": "Tel. <a href='tel:+351932509664'>932 509 664</a>", "fecha_publicacion": "2025-07-28" },
      { "id": 103, "titulo": "Repositor Noturnos", "descripcion": "O Grupo Constant está a recrutar repositor noturnos para o Algarve!.", "imagen_url": "img_servicos_personales/encarregado_obra.png", "ciudad": "Sintra", "contacto": "Tel. <a href='tel:+351964845621'>964 845 621</a>", "fecha_publicacion": "2025-07-20" },
      { "id": 104, "titulo": "Empregado de Mesa", "descripcion": "Empregado/a de mesa para um restaurant em Loulé. Horário de jantar entrada as 17h.", "imagen_url": "img_servicos_personales/mesero_camarero.png", "ciudad": "Funchal", "contacto": "Tel. <a href='tel:+351964845621'>964 845 621</a>", "fecha_publicacion": "2025-07-15" },
      { "id": 105, "titulo": "Cargas e Descargas", "descripcion": "A Eurofirms Services recruta Op. Cargas e Descargas (M/F) para serviço pontual.", "imagen_url": "img_servicos_personales/empleado_construccion.png", "ciudad": "Lisboa", "contacto": "Tel. <a href='tel:+351914103252'>914 103 252</a>", "fecha_publicacion": "2025-07-10" },
      { "id": 106, "titulo": "Carpinteiro", "descripcion": "Carpinteiro de Cozinhas de Luxo", "imagen_url": "img_servicos_personales/carpintero.png", "ciudad": "Lisboa", "contacto": "Email: <a href='mailto:issrecruitmentportugal@gmail.com'>issrecruitmentportugal@gmail.com</a>", "fecha_publicacion": "2025-07-10" },
      { "id": 107, "titulo": "Mecânico", "descripcion": "Mecânico/a Automóveis Entrada imediata.", "imagen_url": "img_servicos_personales/mechanic.png", "ciudad": "Lisboa", "contacto": "Email: <a href='mailto:casquinha@citroverca.pt'>casquinha@citroverca.pt</a> Tel. <a href='tel:+351962927727'>962 927 727</a>", "fecha_publicacion": "2025-07-10" }
    ],
    "servicios": [
      { "id": 201, "categoria": "Arquitetura", "ciudad": "Lisboa", "titulo": "Arquiteto", "descripcion": "Desenvolvimento de projetos de arquitetura e licenciamento. Orçamentos gratuitos.", "imagen_url": "img_servicos_personales/architect.png", "contacto": "Email: <a href='mailto:helderb8a@gmail.com'>helderb8a@gmail.com</a> Tel. <a href='tel:+351911972787'>911 972 787</a>" },
      { "id": 202, "categoria": "Design", "ciudad": "Lisboa", "titulo": "Designer Gráfico", "descripcion": "Criação de logos, flyers, cartões de visita e posts para redes sociais. Orçamentos grátis.", "imagen_url": "img_banner_personal/Grafic_Desing_Yiseth.jpg", "contacto": "Email: <a href='mailto:yisethb2@gmail.com'>yisethb2@gmail.com</a>" },
      { "id": 203, "categoria": "Instalações", "ciudad": "Porto", "titulo": "Técnico de Eletricidade", "descripcion": "Serviços de instalação e reparação elétrica para residências e empresas no Porto.", "imagen_url": "img_servicos_personales/electrician.png", "contacto": "Tel. <a href='tel:+351936986630'>936 986 630</a>" },
      { "id": 204, "categoria": "Design", "ciudad": "Coimbra", "titulo": "Designer de Interiores", "descripcion": "Criação de espaços harmoniosos e funcionais para residências e escritórios em Coimbra.", "imagen_url": "img_servicos_personales/disenador_grafico.png", "contacto": "Email: <a href='mailto:interiores.coimbra@email.com'>interiores.coimbra@email.com</a>" },
      { "id": 205, "categoria": "Obras", "ciudad": "Faro", "titulo": "Encarregado de Obra", "descripcion": "Encarregado de obra com vasta experiência para fiscalização de projetos no Algarve.", "imagen_url": "img_servicos_personales/encarregado_obra.png", "contacto": "Tel. <a href='tel:+351915426582'>915 426 582</a>" }
    ],
    "habitacao": [
      { "id": 301, "tipo": "Quarto", "ciudad": "Lisboa", "titulo": "Quarto Individual na Portela", "descripcion": "Alugo quarto individual remodelado, com serventia de cozinha. Perto de transportes e comércio.", "precio": "520€/mês", "imagen_url": "img_servicos_personales/habitacao.png", "contacto": "Tel. <a href='tel:+351911972787'>911 972 787</a>" }
    ]
  },
  "blog": [
      { "id": 401, "titulo": "Bem-vindo ao PortugalApoia!", "contenido": "Este é o início do nosso blog. Em breve, partilharemos notícias, histórias de sucesso e informações úteis para a nossa comunidade. Fique atento!", "imagen_url": "images/img_portada.webp", "video_url": "", "fecha_publicacion": "2025-07-31" }
  ]
};