// pages/api/figma/file.js
// Proxy pour l'API Figma — contourne les restrictions CORS du navigateur
// GET /api/figma/file?fileKey=XXXXX&token=figd_...

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { fileKey, token } = req.query;

  if (!fileKey) {
    return res.status(400).json({ error: "Paramètre 'fileKey' requis" });
  }

  // Priorité : token en query param > variable d'environnement
  const figmaToken = token || process.env.FIGMA_TOKEN;

  if (!figmaToken) {
    return res.status(401).json({
      error: "Token Figma manquant. Passez ?token=figd_xxx ou configurez FIGMA_TOKEN dans les variables d'environnement Vercel.",
    });
  }

  try {
    const figmaRes = await fetch(
      `https://api.figma.com/v1/files/${fileKey}?geometry=paths`,
      {
        headers: {
          "X-FIGMA-TOKEN": figmaToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!figmaRes.ok) {
      const errText = await figmaRes.text();
      return res.status(figmaRes.status).json({
        error: `Erreur API Figma (${figmaRes.status})`,
        detail: errText,
      });
    }

    const data = await figmaRes.json();

    // Cache 5 minutes côté CDN Vercel
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json(data);
  } catch (err) {
    console.error("[fig2el] Figma file fetch error:", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
}