const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  // 1. Extraer los datos del formulario del evento
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  // 2. Configurar la autenticación con la API de GitHub
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Usaremos una variable de entorno segura
  });

  // 3. Formatear el contenido del anuncio en formato Markdown (como lo espera el CMS)
  // Usamos una "fecha-slug" para asegurar que cada nombre de archivo sea único.
  const slug = new Date().toISOString().split('T')[0] + '-' + data.titulo.toLowerCase().replace(/\s+/g, '-');
  const fileContent = `---
titulo: "${data.titulo}"
tipo_anuncio: "${data['tipo-anuncio']}"
ciudad: "${data.ciudad}"
categoria: "${data.categoria}"
descripcion: "${data.descripcion}"
contacto: "${data.contacto}"
---
`;

  // 4. Preparar la información para subir el archivo a GitHub
  const owner = "tu-usuario-de-github"; // REEMPLAZA con tu usuario
  const repo = "nombre-de-tu-repositorio"; // REEMPLAZA con el nombre de tu repo
  const path = `_anuncios/${slug}.md`; // Ruta donde se guardará el nuevo anuncio
  const message = `Nuevo anuncio: ${data.titulo}`;

  try {
    // 5. Enviar el archivo a GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(fileContent).toString("base64"), // El contenido debe estar en base64
    });

    // 6. Devolver una respuesta de éxito
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