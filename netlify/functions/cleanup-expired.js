// netlify/functions/cleanup-expired.js

const { Octokit } = require("@octokit/rest");

// --- CONFIGURACIÓN ---
const GITHUB_OWNER = "Helder8a";
const GITHUB_REPO = "portugalapoia";
const GITHUB_BRANCH = "main";
const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

// Lista de los ficheros de datos que queremos limpiar
const DATA_FILES = [
    { path: "_dados/doacoes.json", key: "pedidos" },
    { path: "_dados/empregos.json", key: "vagas" },
    { path: "_dados/servicos.json", key: "servicos" },
    { path: "_dados/habitacao.json", key: "anuncios" },
];

exports.handler = async function() {
    console.log("Iniciando a tarefa de limpeza de anúncios caducados...");

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Para comparar apenas a data

    let totalAnunciosRemovidos = 0;
    const nomesAnunciosRemovidos = [];
    const changes = []; // Array para guardar as modificações

    for (const fileInfo of DATA_FILES) {
        try {
            const { data: contentData } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: fileInfo.path,
                ref: GITHUB_BRANCH,
            });

            const content = Buffer.from(contentData.content, 'base64').toString('utf8');
            const jsonContent = JSON.parse(content);
            const items = jsonContent[fileInfo.key] || [];

            const itemsAtivos = items.filter(item => {
                if (item.data_vencimento) {
                    const dataVencimento = new Date(item.data_vencimento);
                    if (dataVencimento < hoje) {
                        totalAnunciosRemovidos++;
                        nomesAnunciosRemovidos.push(`- ${item.titulo} (na secção ${fileInfo.key})`);
                        return false; // Excluir este item
                    }
                }
                return true; // Manter este item
            });

            // Se houveram alterações, preparamos o novo conteúdo
            if (itemsAtivos.length < items.length) {
                jsonContent[fileInfo.key] = itemsAtivos;
                const updatedContent = JSON.stringify(jsonContent, null, 2);
                changes.push({
                    path: fileInfo.path,
                    content: updatedContent,
                    sha: contentData.sha
                });
            }
        } catch (error) {
            console.error(`Erro ao processar o ficheiro ${fileInfo.path}:`, error);
        }
    }

    // Se não encontrámos anúncios para remover, terminamos a execução.
    if (totalAnunciosRemovidos === 0) {
        console.log("Nenhum anúncio caducado encontrado. Tarefa concluída.");
        return { statusCode: 200, body: "Nenhum anúncio para limpar." };
    }

    // Se encontrámos, criamos a Pull Request
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newBranchName = `cleanup/expired-ads-${timestamp}`;

        const { data: refData } = await octokit.git.getRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `heads/${GITHUB_BRANCH}`,
        });
        const baseSha = refData.object.sha;

        await octokit.git.createRef({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            ref: `refs/heads/${newBranchName}`,
            sha: baseSha,
        });

        for (const change of changes) {
             await octokit.repos.createOrUpdateFileContents({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: change.path,
                message: `Limpeza automática: remove anúncios caducados de ${change.path}`,
                content: Buffer.from(change.content).toString('base64'),
                sha: change.sha,
                branch: newBranchName,
            });
        }
       
        await octokit.pulls.create({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            title: `Limpeza Automática: ${totalAnunciosRemovidos} anúncios caducados para remover`,
            head: newBranchName,
            base: GITHUB_BRANCH,
            body: `Esta Pull Request foi gerada automaticamente para remover anúncios que já passaram da sua data de vencimento.\n\n**Anúncios a serem removidos:**\n${nomesAnunciosRemovidos.join("\n")}\n\n*Para aprovar, faça o "Merge" desta Pull Request.*`,
        });

        console.log(`Pull Request criada com sucesso para remover ${totalAnunciosRemovidos} anúncios.`);
        return { statusCode: 200, body: "Pull Request de limpeza criada." };

    } catch (error) {
        console.error("Erro ao criar a Pull Request de limpeza:", error);
        return { statusCode: 500, body: "Erro ao criar a Pull Request." };
    }
};