// generate-posts.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), '_blog');
const outputDirectory = path.join(process.cwd());

function getPostFiles() {
    return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

function generatePostsIndex() {
    console.log("Generating posts index...");
    const postFiles = getPostFiles();
    const allPostsData = postFiles.map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Usar gray-matter para parsear el frontmatter
        const { data, content } = matter(fileContents);

        // Crear un extracto simple
        const excerpt = content.substring(0, 150).replace(/(\r\n|\n|\r)/gm, " ") + '...';

        return {
            slug,
            excerpt,
            ...data,
        };
    });

    // Guardar el índice en un archivo JSON en la carpeta principal
    const outputFile = path.join(outputDirectory, 'posts.json');
    fs.writeFileSync(outputFile, JSON.stringify(allPostsData, null, 2));
    console.log(`Posts index generated successfully at ${outputFile}`);
}

try {
    generatePostsIndex();
} catch (error) {
    console.error("Error generating posts index:", error);
    process.exit(1);
}