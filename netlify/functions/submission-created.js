// netlify/functions/submission-created.js (Versión Final con subida de imágenes)

const { Octokit } = require("@octokit/rest");
const cloudinary = require("cloudinary").v2;
const busboy = require("busboy");

// --- CONFIGURACIÓN DE GITHUB ---
const GITHUB_OWNER = "Helder8a";
const GITHUB_REPO = "portugalapoia";
const GITHUB_BRANCH = "main";
const DIAS_DE_VALIDEZ = 30;

//