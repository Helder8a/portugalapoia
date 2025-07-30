const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const title = data.titulo_anuncio || "Anuncio sin título";
  const slug = new Date().toISOString().split('T')[0] + '-' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const message = `Nuevo anuncio (PENDIENTE DE REVISIÓN): ${title}`; // Mensaje claro para el commit

  // Formatear el contenido del archivo Markdown
  const fileContent = `---
title: "${title}"
tipo_anuncio: "${data.tipo_anuncio || ''}"
published: false # <--- ¡CAMBIO CLAVE AQUÍ! Inicialmente no publicado
ciudad: "${data.cidade_habitacao || data.local_emprego || data.area_atuacao_servico || ''}"
contacto: "${data.contacto || ''}"
imagem: "${data.imagem_anuncio ? `/img_anuncios/${data.imagem_anuncio.name}` : ''}"
body: "${data.descricao || ''}"
---
`;

  const owner = "Helder8a";
  const repo = "portugalapoia";
  const path = `_anuncios/${slug}.md`;

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(fileContent).toString("base64"),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Anuncio enviado para revisión." }), // Mensaje para el usuario
    };
  } catch (error) {
    console.error("Error al publicar el anuncio:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Hubo un error al enviar el anuncio: ${error.message}` }),
    };
  }
};