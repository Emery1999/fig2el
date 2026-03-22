// pages/index.js
import Head from "next/head";
import dynamic from "next/dynamic";

const Fig2elApp = dynamic(() => import("../components/Fig2elApp"), {
  ssr: false,
  loading: () => (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#05070d", flexDirection:"column", gap:20 }}>
      <div style={{ width:48, height:48, borderRadius:"50%", border:"2px solid #1d2438", borderTopColor:"#00e8b3", animation:"spin .75s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:"#44526e", fontSize:13, fontFamily:"system-ui" }}>Chargement fig2el v4…</p>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Head>
        <title>fig2el v4 — Figma → Elementor Visual Converter</title>
        <meta name="description" content="Visualisez vos designs Figma, sélectionnez les calques visuellement, exportez en HTML/CSS hybride pixel-perfect et JSON Elementor." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#05070d" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2300e8b3'/><text y='22' x='4' font-size='17' font-weight='900' font-family='monospace' fill='%23000'>f2e</text></svg>" />
      </Head>
      <Fig2elApp />
    </>
  );
}
