//================================================================
//==                                                            ==
//==         PANEL DE CONTROL DE ANUNCIOS - PortugalApoia         ==
//==                                                            ==
//==          ESTE ES EL ARCHIVO DE BASE DE DATOS               ==
//==                                                            ==
//================================================================

const todosOsAnuncios = [

  // ===============================================================
  // ==                      EMPREGO                               ==
  // ===============================================================
  {
    id: 'EMP-001',
    tipo: 'emprego',
    titulo: 'Ajudante Familiar',
    cidade: 'Lisboa',
    descricao: 'Ajudante Familiar para Serviço Interno na zona de Cascais.',
    contacto: 'tel:+351919110464',
    imagem: 'img_servicos/enfermeria.png',
    dataPublicacao: '2025-07-28'
  },
  {
    id: 'EMP-002',
    tipo: 'emprego',
    titulo: 'Limpeza Depois da Obra',
    cidade: 'Lisboa',
    descricao: 'Mulheres na Obra Demolicao.',
    contacto: 'tel:+351932509664',
    imagem: 'img_servicos/limpeza_geral.png',
    dataPublicacao: '2025-07-28'
  },
  {
    id: 'EMP-003',
    tipo: 'emprego',
    titulo: 'Repositor Noturnos',
    cidade: 'Sintra',
    descricao: 'O Grupo Constant está a recrutar repositor noturnos para o Algarve!',
    contacto: 'tel:+351964845621',
    imagem: 'img_servicos/obra_encarregado.png',
    dataPublicacao: '2025-07-20'
  },
  {
    id: 'EMP-004',
    tipo: 'emprego',
    titulo: 'Empregado/a de Mesa',
    cidade: 'Funchal',
    descricao: 'Empregado/a de mesa para um restaurante em Loulé. Horário de jantar entrada as 17h.',
    contacto: 'tel:+351964845621',
    imagem: 'img_servicos/mesero_camarero.png',
    dataPublicacao: '2025-07-15'
  },
  {
    id: 'EMP-005',
    tipo: 'emprego',
    titulo: 'Cargas e Descargas',
    cidade: 'Lisboa',
    descricao: 'A Eurofirms Services recruta Op. Cargas e Descargas (M/F) para serviço pontual.',
    contacto: 'tel:+351914103252',
    imagem: 'img_servicos/obra_pedreiro.png',
    dataPublicacao: '2025-07-10'
  },
  {
    id: 'EMP-006',
    tipo: 'emprego',
    titulo: 'Carpinteiro de Cozinhas de Luxo',
    cidade: 'Lisboa',
    descricao: 'Carpinteiro de Cozinhas de Luxo',
    contacto: 'mailto:issrecruitmentportugal@gmail.com',
    imagem: 'img_servicos/obra_carpinteiro_cozinha_puertas.png',
    dataPublicacao: '2025-07-10'
  },
  {
    id: 'EMP-007',
    tipo: 'emprego',
    titulo: 'Mecânico de Automóveis',
    cidade: 'Lisboa',
    descricao: 'Mecânico/a Automóveis Entrada imediata.',
    contacto: 'mailto:casquinha@citroverca.pt',
    contacto2: 'tel:+351962927727',
    imagem: 'img_servicos/mecânico_automóveis.png',
    dataPublicacao: '2025-07-10'
  },
  // ... (Aquí puedes seguir añadiendo el resto de anuncios de empleo) ...


  // ===============================================================
  // ==                      SERVIÇOS                              ==
  // ===============================================================
  {
    id: 'SER-001',
    tipo: 'servico',
    categoria: 'Arquitetura',
    cidade: 'Lisboa',
    titulo: 'Arquiteto',
    descricao: 'Desenvolvimento de projetos de arquitetura e licenciamento. Orçamentos gratuitos.',
    contacto: 'mailto:helderb8a@gmail.com',
    contacto2: 'tel:+351911972787',
    imagem: 'img_servicos/arquiteto.png',
    dataPublicacao: '2025-07-29'
  },
  {
    id: 'SER-002',
    tipo: 'servico',
    categoria: 'Design',
    cidade: 'Lisboa',
    titulo: 'Designer Gráfico',
    descricao: 'Criação de logos, flyers, cartões de visita e posts para redes sociais. Orçamentos grátis.',
    contacto: 'mailto:yisethb2@gmail.com',
    imagem: 'img_banner/Grafic_Desing_Yiseth.jpg',
    dataPublicacao: '2025-07-28'
  },
  // ... (Aquí puedes seguir añadiendo anuncios de serviços) ...


  // ===============================================================
  // ==                      HABITAÇÃO                             ==
  // ===============================================================
  {
    id: 'HAB-001',
    tipo: 'habitacao',
    categoria: 'Quarto',
    cidade: 'Lisboa',
    titulo: 'Quarto Individual na Portela',
    descricao: 'Alugo quarto individual remodelado, com serventia de cozinha. Perto de transportes e comércio.<br><strong>Valor:</strong> 520€/mês',
    contacto: 'tel:+351911972787',
    imagem: 'img_servicos/aluguel_habitacao_quarto.png',
    dataPublicacao: '2025-07-30'
  },
  // ... (Aquí puedes seguir añadiendo anuncios de habitação) ...


  // ===============================================================
  // ==                      DOAÇÕES                               ==
  // ===============================================================
   {
    id: 'DOA-001',
    tipo: 'doacao',
    categoria: 'Roupa',
    cidade: 'Porto',
    titulo: 'Roupas de Inverno',
    descricao: 'Estamos a recolher casacos, camisolas e mantas para distribuir por pessoas em situação de sem-abrigo na cidade do Porto. Qualquer ajuda é bem-vinda.',
    contacto: 'mailto:ajuda.porto@email.com?subject=Resposta ao anúncio: Roupas de Inverno (#DOA-001)',
    imagem: '',
    dataPublicacao: '2025-07-29'
  }
  // ... (Aquí puedes seguir añadiendo anuncios de doação) ...

];