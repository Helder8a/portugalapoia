// netlify/functions/submission-created.js

const { Octokit } = require("@octokit/rest");
const sgMail = require('@sendgrid/mail');

// --- CONFIGURAÇÃO ---
const DIAS_DE_VALIDEZ = 30;
const GITHUB_OWNER = "Helder8a";
const GITHUB_REPO = "portugalapoia";
const GITHUB_BRANCH = "main";
const SENDER_EMAIL = "helderb8a@gmail.com"; // O seu e-mail verificado no SendGrid

// Configura o SendGrid com a chave de API das variáveis de ambiente
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function (event) {
  // Inicializa a comunicação com o GitHub
  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

  // Extrai os dados do formulário
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  // Determina o ficheiro e a chave a serem atualizados
  const filePath = `_dados/${data.category}.json`;
  const dataKey = {
    doacoes: "pedidos",
    empregos: "vagas",
    servicos: "servicos",
    habitacao: "anuncios",
  }[data.category];

  if (!dataKey) {
    return { statusCode: 400, body: "Categoria não válida." };
  }

  // --- LÓGICA DE DATAS AUTOMÁTICA ---
  const hoje = new Date();
  const dataPublicacao = hoje.toISOString().split("T")[0];
  const dataVencimento = new Date(hoje);
  dataVencimento.setDate(hoje.getDate() + DIAS_DE_VALIDEZ);
  const dataVencimentoFormatada = dataVencimento.toISOString().split("T")[0];

  // Cria o novo objeto do anúncio
  const newId = `${data.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
  const newEntry = {
    id: newId,
    titulo: data.title,
    localizacao: data.location,
    descricao: data.description,
    contato: data["contact-phone"] || "",
    link_contato: data["contact-email"] || "",
    data_publicacao: dataPublicacao,
    data_vencimento: dataVencimentoFormatada,
  };

  try {
    // --- PROCESSO DE CRIAÇÃO DE PULL REQUEST NO GITHUB ---

    // 1. Obter a referência do ramo principal para saber a partir de onde ramificar
    const { data: refData } = await octokit.git.getRef({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`,
    });
    const baseSha = refData.object.sha;

    // 2. Criar um novo ramo com um nome único para este anúncio
    const newBranchName = `anuncio/${newId}`;
    await octokit.git.createRef({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `refs/heads/${newBranchName}`, sha: baseSha,
    });
    
    // 3. Obter o conteúdo atual do ficheiro JSON
    const { data: contentData } = await octokit.repos.getContent({
        owner: GITHUB_OWNER, repo: GITHUB_REPO, path: filePath, ref: GITHUB_BRANCH // Obtém do ramo principal
    });
    
    const content = Buffer.from(contentData.content, 'base64').toString('utf8');
    const jsonContent = JSON.parse(content);
    
    // 4. Adicionar o novo anúncio à lista
    jsonContent[dataKey].push(newEntry);
    const updatedContent = JSON.stringify(jsonContent, null, 2);

    // 5. Atualizar o ficheiro no novo ramo que criámos
    await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER, repo: GITHUB_REPO, path: filePath,
        message: `Novo anúncio para revisão: ${data.title}`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: contentData.sha,
        branch: newBranchName
    });

    // 6. Criar a "Pull Request" para que você possa revisá-la e aprová-la
    await octokit.pulls.create({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      title: `Revisar Anúncio: "${data.title}"`,
      head: newBranchName,
      base: GITHUB_BRANCH,
      body: `**Novo anúncio recebido do formulário público.**\n\n**Título:** ${data.title}\n**Categoria:** ${data.category}\n**Localização:** ${data.location}\n\n**Descrição:**\n${data.description}\n\n*Para aprovar, faça o "Merge" desta Pull Request.*`,
    });
    console.log(`Pull Request criada para o anúncio "${data.title}".`);

    // --- ENVIO DA NOTIFICAÇÃO POR E-MAIL ---
    const recipientEmail = data['contact-email'];
    if (recipientEmail && process.env.SENDGRID_API_KEY) {
      const msg = {
        to: recipientEmail,
        from: SENDER_EMAIL,
        subject: `Recebemos o seu anúncio: "${data.title}"`,
        html: `<html><body><h2>Olá!</h2><p>Recebemos o seu anúncio "<strong>${data.title}</strong>" com sucesso!</p><p>A nossa equipa irá revê-lo. Se for aprovado, será publicado brevemente.</p><p>Obrigado por fazer parte da nossa comunidade.</p><p>Com os melhores cumprimentos,<br><strong>Equipa PortugalApoia</strong></p></body></html>`,
      };
      await sgMail.send(msg);
      console.log(`E-mail de confirmação enviado para: ${recipientEmail}`);
    }

    return { statusCode: 200, body: "Pull Request criada e notificação enviada." };

  } catch (error) {
    console.error("Erro na função da Netlify:", error);
    return { statusCode: 500, body: `Erro ao processar o anúncio: ${error.message}` };
  }
};