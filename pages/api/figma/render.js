// pages/api/figma/render.js  — V4
// Renders any Figma node to PNG/SVG — used for hybrid mode and visual preview
// GET /api/figma/render?fileKey=X&ids=1:2,3:4&scale=2&format=png

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { fileKey, ids, scale = "2", format = "png", token } = req.query;
  if (!fileKey || !ids) return res.status(400).json({ error: "fileKey et ids requis" });

  const figmaToken = token || process.env.FIGMA_TOKEN;
  if (!figmaToken) return res.status(401).json({ error: "FIGMA_TOKEN manquant" });

  try {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&scale=${scale}&format=${format}&svg_include_id=true`;
    const r = await fetch(url, { headers: { "X-FIGMA-TOKEN": figmaToken } });

    if (!r.ok) return res.status(r.status).json({ error: `Figma render error ${r.status}` });

    const data = await r.json();
    // data.images = { "nodeId": "https://..." }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
