const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // 1. Extraer los datos del formulario del evento
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  // 2. Configurar la autenticación con la API de GitHub
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Variable de entorno segura de Netlify
  });

  // 3. Definir las variables a partir de los datos del formulario
  const titulo = data.titulo_anuncio; // Usamos la variable correcta del formulario
  const slug = new Date().toISOString().split('T')[0] + '-' + titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const message = `Nuevo anuncio: ${titulo}`; // Creamos el mensaje para el commit

  // 4. Formatear el contenido del anuncio en formato Markdown
  const fileContent = `---
titulo: "${titulo}"
tipo_anuncio: "${data.tipo_anuncio || ''}"
preco: "${data.preco_habitacao || ''}"
cidade: "${data.cidade_habitacao || data.local_emprego || data.area_atuacao_servico || ''}"
tipo_contrato: "${data.tipo_contrato || ''}"
experiencia: "${data.experiencia_emprego || ''}"
categoria_servico: "${data.categoria_servico || ''}"
descricao: "${data.descricao || ''}"
contacto: "${data.contacto || ''}"
---
`;

  // 5. Preparar la información para subir el archivo a GitHub
  const owner = "Helder8a"; // Tu usuario de GitHub
  const repo = "portugalapoia"; // Tu repositorio
  const path = `_anuncios/${slug}.md`; // Ruta donde se guardará el nuevo anuncio

  try {
    // 6. Enviar el archivo a GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(fileContent).toString("base64"), // El contenido debe estar en base64
    });

    // 7. Devolver una respuesta de éxito
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Anuncio publicado exitosamente." }),
    };
  } catch (error) {
    console.error("Error al publicar el anuncio:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Hubo un error al publicar el anuncio." }),
    };
  }
};