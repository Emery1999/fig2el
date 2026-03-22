// pages/index.js
import Head from "next/head";
import dynamic from "next/dynamic";

// Chargement client-side uniquement (le composant utilise window, iframe, etc.)
const Fig2elApp = dynamic(() => import("../components/Fig2elApp"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#05070d", flexDirection: "column", gap: 20,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: "2px solid #1d2438", borderTopColor: "#00e8b3",
        animation: "spin .75s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: "#44526e", fontSize: 13, fontFamily: "system-ui" }}>Chargement de fig2el…</p>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Head>
        <title>fig2el — Figma → Elementor Converter</title>
        <meta name="description" content="Convertissez vos designs Figma en HTML, CSS et JSON Elementor pixel-perfect. Sélection des calques, preview live, export direct WordPress." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#05070d" />

        {/* Open Graph */}
        <meta property="og:title" content="fig2el — Figma → Elementor" />
        <meta property="og:description" content="Transformez vos designs Figma en templates Elementor prêts pour WordPress." />
        <meta property="og:type" content="website" />

        {/* Favicon inline SVG */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2300e8b3'/><text y='22' x='5' font-size='18' font-weight='800' font-family='monospace' fill='%23000'>f2</text></svg>" />
      </Head>

      <Fig2elApp />
    </>
  );
}