// pages/api/figma/file.js  — V4
// Fetches Figma file + optionally renders frames to images
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { fileKey, token, withImages } = req.query;
  if (!fileKey) return res.status(400).json({ error: "fileKey requis" });

  const figmaToken = token || process.env.FIGMA_TOKEN;
  if (!figmaToken) return res.status(401).json({ error: "FIGMA_TOKEN manquant" });

  try {
    const figmaRes = await fetch(
      `https://api.figma.com/v1/files/${fileKey}?geometry=paths`,
      { headers: { "X-FIGMA-TOKEN": figmaToken } }
    );
    if (!figmaRes.ok) {
      const txt = await figmaRes.text();
      return res.status(figmaRes.status).json({ error: `API Figma ${figmaRes.status}`, detail: txt });
    }
    const data = await figmaRes.json();

    // Optionally fetch frame thumbnail URLs
    if (withImages === "true") {
      try {
        const frames = (data.document?.children || [])
          .flatMap(p => p.children || [])
          .filter(n => ["FRAME", "COMPONENT"].includes(n.type))
          .map(n => n.id);

        if (frames.length > 0) {
          const imgRes = await fetch(
            `https://api.figma.com/v1/images/${fileKey}?ids=${frames.join(",")}&format=png&scale=1`,
            { headers: { "X-FIGMA-TOKEN": figmaToken } }
          );
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            data.__framePreviews = imgData.images || {};
          }
        }
      } catch (e) {
        // Non-blocking — previews are optional
        data.__framePreviews = {};
      }
    }

    res.setHeader("Cache-Control", "s-maxage=180, stale-while-revalidate=60");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
