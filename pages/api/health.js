// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    version: "3.0.0",
    name: "fig2el",
    figmaTokenConfigured: !!process.env.FIGMA_TOKEN,
    timestamp: new Date().toISOString(),
  });
}