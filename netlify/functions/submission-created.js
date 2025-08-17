// netlify/functions/submission-created.js

const { Octokit } = require("@octokit/rest");

const DIAS_DE_VALIDEZ = 30;
const GITHUB_OWNER = "Helder8a";
const GITHUB_REPO = "portugalapoia";
const GITHUB_BRANCH = "main";

exports.handler = async function (event) {
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  const filePath = `_dados/${data.category}.json`;
  const dataKey = {
    doacoes: "pedidos",
    empregos: "vagas",
    servicos: "servicos",
    habitacao: "anuncios"
  }[data.category];

  if (!dataKey) {
    return { statusCode: 400, body: "Categoría no válida." };
  }

  const hoje = new Date();
  const dataPublicacao = hoje.toISOString().split('T')[0];
  const dataVencimento = new Date(hoje);
  dataVencimento.setDate(hoje.getDate() + DIAS_DE_VALIDEZ);
  const dataVencimentoFormatada = dataVencimento.toISOString().split('T')[0];

  const newId = `${data.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
  const newEntry = {
    id: newId,
    titulo: data.title,
    localizacao: data.location,
    descricao: data.description,
    contato: data['contact-phone'] || "",
    link_contato: data['contact-email'] || "",
    data_publicacao: dataPublicacao,
    data_vencimento: dataVencimentoFormatada
  };

  try {
    const { data: refData } = await octokit.git.getRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}` });
    const baseSha = refData.object.sha;

    const newBranchName = `anuncio/${newId}`;
    await octokit.git.createRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `refs/heads/${newBranchName}`, sha: baseSha });

    const { data: contentData } = await octokit.repos.getContent({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path: filePath, ref: newBranchName });

    const content = Buffer.from(contentData.content, 'base64').toString('utf8');
    const jsonContent = JSON.parse(content);
    jsonContent[dataKey].push(newEntry);
    const updatedContent = JSON.stringify(jsonContent, null, 2);

    await octokit.repos.createOrUpdateFileContents({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path: filePath, message: `Novo anúncio para revisão: ${data.title}`, content: Buffer.from(updatedContent).toString('base64'), sha: contentData.sha, branch: newBranchName });

    await octokit.pulls.create({ owner: GITHUB_OWNER, repo: GITHUB_REPO, title: `Revisar Anúncio: "${data.title}"`, head: newBranchName, base: GITHUB_BRANCH, body: `**Novo anúncio recebido do formulário público.**\n\n**Título:** ${data.title}\n**Categoria:** ${data.category}\n**Localização:** ${data.location}\n\n**Descrição:**\n${data.description}\n\n*Para aprovar, faça o "Merge" desta Pull Request.*` });

    return { statusCode: 200, body: "Pull Request creada con éxito." };

  } catch (error) {
    console.error("Error en la función de Netlify:", error);
    return { statusCode: 500, body: `Error al procesar el anuncio: ${error.message}` };
  }
};