import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Remove caracteres especiais e espaços do nome do arquivo
 */
function sanitizeFileName(fileName) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();
}

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param {File} file - Arquivo de imagem
 * @param {string} folder - Pasta no storage (ex: 'noticias')
 * @returns {Promise<string>} URL pública da imagem
 */
export async function uploadImage(file, folder = "noticias") {
  try {
    const timestamp = Date.now();
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${timestamp}_${sanitizedName}`;
    
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
}
