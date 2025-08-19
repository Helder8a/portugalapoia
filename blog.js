// Obtiene la lista de posts del blog.
// El nombre del archivo se obtiene de la fecha y el título del post.
const getBlogPosts = async () => {
  // Reemplaza con la ruta correcta a tu carpeta de posts si es diferente.
  const postsDir = './_blog/';
  const response = await fetch(postsDir);
  const text = await response.text();

  // Se asume que el servidor devuelve una lista de enlaces.
  // Es mejor si el servidor responde con un JSON para un manejo más fácil.
  // Aquí se hace una suposición para el ejemplo.
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const links = Array.from(doc.querySelectorAll('a'))
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.endsWith('.md'));

  return links;
};

// Lee un archivo de post y extrae el frontmatter y el contenido.
const readPostFile = async (filePath) => {
  const response = await fetch(filePath);
  const text = await response.text();
  const parts = text.split('---');
  const frontmatter = parts[1];
  const content = parts.slice(2).join('---').trim();

  // Parsea el frontmatter YAML.
  const yaml = frontmatter.split('\n').filter(line => line.trim() !== '');
  const metadata = {};
  yaml.forEach(line => {
    const [key, value] = line.split(':');
    if (key && value) {
      metadata[key.trim()] = value.trim().replace(/"/g, '');
    }
  });

  return { metadata, content };
};

// Renderiza los posts en la página.
const renderBlogPosts = async () => {
  const postsList = document.getElementById('blog-full-content');
  postsList.innerHTML = ''; // Limpia el contenido estático.

  const postLinks = await getBlogPosts();

  for (const link of postLinks) {
    const postData = await readPostFile(`_blog/${link}`);
    const postHTML = `
      <article>
        <h2>${postData.metadata.title}</h2>
        <p>Fecha de publicación: ${new Date(postData.metadata.date).toLocaleDateString()}</p>
        <div>
          ${marked.parse(postData.content)}
        </div>
      </article>
      <hr>
    `;
    postsList.innerHTML += postHTML;
  }
};

// Carga las librerías necesarias y ejecuta la función.
const loadAndRender = async () => {
  // Carga marked.js para convertir Markdown a HTML.
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  script.onload = () => {
    renderBlogPosts();
  };
  document.head.appendChild(script);
};

// Llama a la función principal para iniciar el proceso.
document.addEventListener('DOMContentLoaded', loadAndRender);