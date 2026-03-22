// pages/api/figma/images.js
// Récupère les URLs des images/assets Figma
// GET /api/figma/images?fileKey=XXXXX&ids=1:2,3:4&scale=2&format=png

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { fileKey, ids, scale = "2", format = "png", token } = req.query;

  if (!fileKey || !ids) {
    return res.status(400).json({ error: "Paramètres 'fileKey' et 'ids' requis" });
  }

  const figmaToken = token || process.env.FIGMA_TOKEN;
  if (!figmaToken) {
    return res.status(401).json({ error: "Token Figma manquant" });
  }

  try {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&scale=${scale}&format=${format}`;

    const figmaRes = await fetch(url, {
      headers: { "X-FIGMA-TOKEN": figmaToken },
    });

    if (!figmaRes.ok) {
      return res.status(figmaRes.status).json({
        error: `Erreur API Figma images (${figmaRes.status})`,
      });
    }

    const data = await figmaRes.json();

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=120");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json(data);
  } catch (err) {
    console.error("[fig2el] Figma images fetch error:", err);
    return res.status(500).json({ error: err.message });
  }
}
