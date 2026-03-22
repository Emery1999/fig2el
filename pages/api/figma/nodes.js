// pages/api/figma/nodes.js
// Récupère des nœuds spécifiques par IDs
// GET /api/figma/nodes?fileKey=XXXXX&ids=1:2,3:4

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { fileKey, ids, token } = req.query;

  if (!fileKey || !ids) {
    return res.status(400).json({ error: "Paramètres 'fileKey' et 'ids' requis" });
  }

  const figmaToken = token || process.env.FIGMA_TOKEN;
  if (!figmaToken) {
    return res.status(401).json({ error: "Token Figma manquant" });
  }

  try {
    const figmaRes = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
      { headers: { "X-FIGMA-TOKEN": figmaToken } }
    );

    if (!figmaRes.ok) {
      return res.status(figmaRes.status).json({ error: `Erreur API Figma (${figmaRes.status})` });
    }

    const data = await figmaRes.json();
    res.setHeader("Cache-Control", "s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
