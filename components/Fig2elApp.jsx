// components/Fig2elApp.jsx — fig2el V4
// Visual Figma preview + clickable layer selection + hybrid CSS+Images export
import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ══════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#05070d;--s1:#090c15;--s2:#0d1120;--s3:#12172a;--s4:#171d30;--s5:#1e2540;
  --r1:#1e2740;--r2:#28345a;--r3:#344070;
  --go:#00e8b3;--go2:#00c49a;--vi:#7b6ff0;--vi2:#a89cf8;
  --re:#ff5c6a;--am:#f5a623;--em:#22d87a;
  --f0:#edf0f9;--f1:#b8c2dc;--f2:#7a8aaa;--f3:#44526e;
  --fui:'Inter',sans-serif;--fhd:'Syne',sans-serif;--fmono:'JetBrains Mono',monospace;
  --r:8px;--r2:14px;--r3:22px;
}
html,body,#__next{height:100%;background:var(--bg);color:var(--f0);font-family:var(--fui);font-size:14px;overflow:hidden}
::selection{background:rgba(0,232,179,.2)}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:var(--r2);border-radius:99px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
@keyframes popIn{0%{opacity:0;transform:scale(.9)}100%{opacity:1;transform:scale(1)}}
@keyframes scanline{0%{top:-4px}100%{top:100%}}
.u-up{animation:fadeUp .3s ease forwards}
.u-pop{animation:popIn .25s cubic-bezier(.34,1.46,.64,1) forwards}
/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--fui);font-size:13px;font-weight:500;cursor:pointer;border:none;border-radius:var(--r);transition:all .18s;outline:none;white-space:nowrap;user-select:none}
.btn:disabled{opacity:.35;pointer-events:none}
.bp{background:var(--go);color:#000;font-weight:700;padding:9px 22px}
.bp:hover{background:#00ffd0;box-shadow:0 0 24px rgba(0,232,179,.3);transform:translateY(-1px)}
.bs{background:var(--s4);color:var(--f0);border:1px solid var(--r1);padding:9px 18px}
.bs:hover{border-color:var(--r3)}
.bg{background:transparent;color:var(--f2);padding:7px 12px;border-radius:var(--r)}
.bg:hover{background:var(--s3);color:var(--f0)}
.bic{width:28px;height:28px;padding:0;justify-content:center;background:var(--s3);border:1px solid var(--r1);border-radius:var(--r);color:var(--f2)}
.bic:hover{border-color:var(--r2);color:var(--f0)}
/* inputs */
input,textarea,select{background:var(--s3);border:1px solid var(--r1);color:var(--f0);border-radius:var(--r);padding:9px 13px;font-family:var(--fui);font-size:13px;outline:none;transition:border-color .18s,box-shadow .18s;width:100%}
input:focus,textarea:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(0,232,179,.08)}
input::placeholder,textarea::placeholder{color:var(--f3)}
/* panels */
.pnl{background:var(--s2);border:1px solid var(--r1);border-radius:var(--r2);overflow:hidden}
.phd{padding:10px 14px;border-bottom:1px solid var(--r1);display:flex;align-items:center;gap:8px;flex-shrink:0}
.plbl{font-size:10px;font-weight:700;color:var(--f3);letter-spacing:.08em}
/* tags */
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;font-family:var(--fmono);letter-spacing:.03em}
.tf{background:rgba(123,111,240,.12);color:#b3acff;border:1px solid rgba(123,111,240,.22)}
.tt{background:rgba(0,232,179,.09);color:var(--go);border:1px solid rgba(0,232,179,.2)}
.ti{background:rgba(255,92,106,.09);color:#ff9ea6;border:1px solid rgba(255,92,106,.18)}
.tb{background:rgba(245,166,35,.09);color:#ffc55e;border:1px solid rgba(245,166,35,.2)}
.th{background:rgba(34,216,122,.09);color:#5fec9e;border:1px solid rgba(34,216,122,.18)}
.tg{background:rgba(74,82,110,.14);color:var(--f2);border:1px solid var(--r1)}
/* checkbox */
.chk{width:15px;height:15px;border:1.5px solid var(--r2);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;cursor:pointer}
.chk.on{background:var(--go);border-color:var(--go)}
.chk.ind{background:rgba(0,232,179,.18);border-color:var(--go)}
/* canvas overlay */
.node-overlay{position:absolute;cursor:pointer;transition:all .12s;box-sizing:border-box}
.node-overlay:hover{outline:2px solid var(--go);outline-offset:1px;z-index:10}
.node-overlay.sel{outline:2px solid var(--go);background:rgba(0,232,179,.08);z-index:11}
.node-overlay.hov{outline:2px dashed rgba(0,232,179,.5);z-index:9}
/* code */
.cblk{background:#040610;border:1px solid var(--r1);border-radius:var(--r2);overflow:auto;font-family:var(--fmono);font-size:11.5px;line-height:1.72}
.cblk pre{padding:16px 20px;color:#c5d0e6;white-space:pre;min-width:max-content}
.sy-k{color:#c792ea}.sy-s{color:#c3e88d}.sy-n{color:#f78c6c}
.sy-c{color:#3d5066;font-style:italic}.sy-p{color:#82aaff}
.sy-v{color:var(--go)}.sy-t{color:#ef9080}.sy-a{color:#ffcb6b}.sy-cl{color:#80cbc4}
/* tabs */
.tbar{display:flex;gap:2px;padding:3px;background:var(--s3);border-radius:10px;border:1px solid var(--r1)}
.tbtn{flex:1;padding:6px 10px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;background:transparent;border:none;color:var(--f3);font-family:var(--fui);transition:all .15s;text-align:center}
.tbtn.on{background:var(--s2);color:var(--f0);box-shadow:0 1px 5px rgba(0,0,0,.35)}
/* preview device */
.dvbtn{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;border:1px solid transparent;color:var(--f3);font-family:var(--fui);transition:all .15s;display:flex;align-items:center;gap:4px}
.dvbtn.on{background:var(--s4);border-color:var(--r2);color:var(--f0)}
/* node row */
.nrow{display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:6px;cursor:pointer;transition:background .1s;min-height:28px;border:1px solid transparent}
.nrow:hover{background:var(--s3)}
.nrow.act{background:rgba(0,232,179,.06);border-color:rgba(0,232,179,.16)}
/* export card */
.xcard{background:var(--s3);border:1px solid var(--r1);border-radius:var(--r2);padding:20px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.xcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,232,179,.05),transparent);opacity:0;transition:opacity .2s}
.xcard:hover{border-color:rgba(0,232,179,.4);transform:translateY(-2px);box-shadow:0 0 28px rgba(0,232,179,.12)}
.xcard:hover::before{opacity:1}
.xcard.feat{border-color:rgba(0,232,179,.25)}
/* hybrid badge */
.hybadge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:10px;font-weight:700;background:linear-gradient(90deg,rgba(0,232,179,.12),rgba(123,111,240,.12));border:1px solid rgba(0,232,179,.25);color:var(--go)}
/* toast */
.toast{position:fixed;bottom:22px;right:22px;padding:10px 16px;border-radius:var(--r);display:flex;align-items:center;gap:9px;font-size:13px;animation:popIn .25s ease;z-index:9999;border:1px solid var(--r2);background:var(--s4);box-shadow:0 8px 32px rgba(0,0,0,.5)}
/* loader */
.ldr{position:fixed;inset:0;background:rgba(5,7,13,.92);z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;backdrop-filter:blur(10px)}
.spin{width:52px;height:52px;border-radius:50%;border:2px solid var(--s5);border-top-color:var(--go);animation:spin .75s linear infinite;position:relative}
.spin::after{content:'';position:absolute;inset:6px;border-radius:50%;border:2px solid var(--s4);border-top-color:var(--vi);animation:spin 1.1s linear infinite reverse}
.pg{width:200px;height:3px;background:var(--s5);border-radius:99px;overflow:hidden}
.pgf{height:100%;background:linear-gradient(90deg,var(--vi),var(--go));border-radius:99px;transition:width .35s ease}
/* skel */
.skel{background:linear-gradient(90deg,var(--s3) 25%,var(--s4) 50%,var(--s3) 75%);background-size:300% 100%;animation:shimmer 1.4s infinite;border-radius:5px}
/* canvas container */
.figma-canvas{position:relative;overflow:auto;background:var(--bg);flex:1}
.canvas-inner{position:relative;transform-origin:top left}
/* frame thumbnail */
.frame-thumb{border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .2s;position:relative}
.frame-thumb:hover{border-color:rgba(0,232,179,.5)}
.frame-thumb.sel{border-color:var(--go);box-shadow:0 0 20px rgba(0,232,179,.2)}
.frame-thumb img{width:100%;display:block}
/* fidelity bar */
.fidbar{height:3px;background:var(--s5);border-radius:99px;overflow:hidden}
.fidfl{height:100%;border-radius:99px;transition:width .5s cubic-bezier(.4,0,.2,1)}
/* mode selector */
.mode-card{background:var(--s3);border:1.5px solid var(--r1);border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .18s}
.mode-card:hover{border-color:var(--r3)}
.mode-card.on{border-color:var(--go);background:rgba(0,232,179,.05)}
/* step nav */
.snav{display:flex;align-items:center;gap:0}
`;

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const I = ({ n, s = 16, c = "currentColor" }) => {
  const d = {
    figma:  "M12 2H8a3 3 0 0 0 0 6h4m0-6h4a3 3 0 0 1 0 6h-4m0-6v6m0 0H8a3 3 0 0 0 0 6h4m0-6h4a3 3 0 0 1 0 6h-4m0-6v6m0 0H8a3 3 0 0 0 0 6h4v-6",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    check:  "M20 6L9 17l-5-5", x:"M18 6L6 18M6 6l12 12",
    arrow:  "M5 12h14M12 5l7 7-7 7", copy:"M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
    eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    code:   "M16 18l6-6-6-6M8 6l-6 6 6 6", export2:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    zap:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z", settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    chevD:  "M6 9l6 6 6-6", chevR:"M9 18l6-6-6-6", minus:"M5 12h14",
    desktop:"M2 3h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm8 18h4M12 17v4",
    tablet: "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 17h.01",
    mobile: "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 17h.01",
    target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 12 6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    image:  "M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 0l7 9 4-4 5 6",
    mix:    "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z",
    link:   "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    info:   "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-9v-4m0 7h.01",
    cursor: "M4 4l7.07 17 2.51-7.39L21 11.07z",
    refresh:"M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
    grid:   "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    hash:   "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }}><path d={d[n] || ""} /></svg>;
};

/* ══════════════════════════════════════════════
   PARSER V3 (same engine, imported inline)
══════════════════════════════════════════════ */
const Parser = {
  toRgba(c, a = 1) {
    if (!c) return "transparent";
    const r = Math.round((c.r || 0) * 255), g = Math.round((c.g || 0) * 255), b = Math.round((c.b || 0) * 255);
    const al = (c.a ?? 1) * a;
    return al >= .995 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${al.toFixed(3)})`;
  },
  gradAngle(h) {
    if (!h || h.length < 2) return 135;
    return Math.round(Math.atan2(h[1].y - h[0].y, h[1].x - h[0].x) * (180 / Math.PI) + 90 + 360) % 360;
  },
  parseFills(node) {
    const fills = (node.fills || []).filter(f => f.visible !== false);
    if (!fills.length) return null;
    const results = [];
    for (const f of fills.slice().reverse()) {
      if (f.type === "SOLID") results.push(this.toRgba(f.color, f.opacity ?? 1));
      else if (f.type === "GRADIENT_LINEAR") {
        const stops = (f.gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
        results.push(`linear-gradient(${this.gradAngle(f.gradientHandlePositions)}deg,${stops})`);
      } else if (f.type === "GRADIENT_RADIAL") {
        const stops = (f.gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
        results.push(`radial-gradient(ellipse at center,${stops})`);
      } else if (f.type === "IMAGE") results.push(`__IMAGE__:${node.id}`);
    }
    return results.length ? results[0] : null;
  },
  parseBg(node) {
    if (node.backgroundColor) {
      const c = this.toRgba(node.backgroundColor);
      if (c !== "transparent") return c;
    }
    return this.parseFills(node);
  },
  parseTypo(node) {
    const s = node.style || {};
    const fills = (node.fills || []).filter(f => f.visible !== false);
    let color = "#ffffff", isGrad = false;
    if (fills[0]?.type === "SOLID") color = this.toRgba(fills[0].color, fills[0].opacity ?? 1);
    else if (fills[0]?.type === "GRADIENT_LINEAR") {
      const stops = (fills[0].gradientStops || []).map(st => `${this.toRgba(st.color)} ${Math.round(st.position * 100)}%`).join(",");
      color = `linear-gradient(${this.gradAngle(fills[0].gradientHandlePositions)}deg,${stops})`; isGrad = true;
    }
    return { fontFamily: s.fontFamily || "inherit", fontSize: s.fontSize || 16, fontWeight: s.fontWeight || 400, lineHeight: s.lineHeightPx ? `${s.lineHeightPx}px` : "1.5", letterSpacing: s.letterSpacing ? `${s.letterSpacing.toFixed(2)}px` : "normal", textAlign: (s.textAlignHorizontal || "LEFT").toLowerCase(), color, isGrad, textDecoration: s.textDecoration === "UNDERLINE" ? "underline" : "none", textTransform: s.textCase === "UPPER" ? "uppercase" : s.textCase === "LOWER" ? "lowercase" : "none", fontStyle: s.italic ? "italic" : "normal" };
  },
  parseLayout(node) {
    if (!node.layoutMode) return null;
    return { display: "flex", flexDirection: node.layoutMode === "HORIZONTAL" ? "row" : "column", alignItems: { MIN: "flex-start", CENTER: "center", MAX: "flex-end", SPACE_BETWEEN: "space-between" }[node.counterAxisAlignItems] || "flex-start", justifyContent: { MIN: "flex-start", CENTER: "center", MAX: "flex-end", SPACE_BETWEEN: "space-between" }[node.primaryAxisAlignItems] || "flex-start", gap: `${node.itemSpacing || 0}px`, flexWrap: node.layoutWrap === "WRAP" ? "wrap" : "nowrap", pt: node.paddingTop || 0, pr: node.paddingRight || 0, pb: node.paddingBottom || 0, pl: node.paddingLeft || 0 };
  },
  parseEffects(node) {
    const ef = (node.effects || []).filter(e => e.visible !== false);
    return {
      boxShadow: ef.filter(e => e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW").map(s => `${s.type === "INNER_SHADOW" ? "inset " : ""}${s.offset?.x || 0}px ${s.offset?.y || 0}px ${s.radius || 0}px ${s.spread || 0}px ${this.toRgba(s.color, s.opacity ?? 1)}`).join(", ") || null,
      filter: ef.find(e => e.type === "LAYER_BLUR") ? `blur(${ef.find(e => e.type === "LAYER_BLUR").radius}px)` : null,
      backdropFilter: ef.find(e => e.type === "BACKGROUND_BLUR") ? `blur(${ef.find(e => e.type === "BACKGROUND_BLUR").radius}px)` : null,
    };
  },
  parseBorder(node) {
    const ss = (node.strokes || []).filter(s => s.visible !== false);
    if (!ss.length) return null;
    return { border: `${node.strokeWeight || 1}px solid ${this.toRgba(ss[0].color, ss[0].opacity ?? 1)}` };
  },
  detectRole(node) {
    const n = (node.name || "").toLowerCase();
    if (n.match(/^hero|^banner/)) return "hero";
    if (n.match(/section|block|wrapper/)) return "section";
    if (n.match(/^nav|^header/)) return "header";
    if (n.match(/^footer/)) return "footer";
    if (n.match(/card|feature/)) return "card";
    if (n.match(/btn|button|cta/)) return "button";
    if (n.match(/img|image|photo|thumb/)) return "image";
    if (n.match(/icon|ico/)) return "icon";
    if (n.match(/badge|pill|tag/)) return "badge";
    if (n.match(/grid|columns/)) return "grid";
    if (n.match(/h1|h2|heading|title/)) return "heading";
    if (n.match(/desc|subtitle|body|text|para/)) return "text";
    if (node.type === "TEXT") { const s = node.style || {}; return s.fontSize >= 36 || (s.fontWeight >= 700 && s.fontSize >= 18) ? "heading" : "text"; }
    return "container";
  },
  parseNode(node, depth = 0, parentBB = null) {
    const bb = node.absoluteBoundingBox || {};
    const w = Math.round(bb.width || 0), h = Math.round(bb.height || 0);
    const ax = Math.round(bb.x || 0), ay = Math.round(bb.y || 0);
    const borderInfo = this.parseBorder(node);
    const parsed = {
      id: node.id, name: node.name, figmaType: node.type, role: this.detectRole(node), depth,
      w, h, ax, ay, rx: parentBB ? ax - Math.round(parentBB.x || 0) : 0, ry: parentBB ? ay - Math.round(parentBB.y || 0) : 0,
      hasLayout: !!this.parseLayout(node), layout: this.parseLayout(node),
      background: this.parseBg(node), fills: node.fills || [],
      effects: this.parseEffects(node), border: borderInfo?.border || null,
      borderRadius: node.cornerRadius ? `${node.cornerRadius}px` : null,
      typo: node.type === "TEXT" ? this.parseTypo(node) : null,
      content: node.characters || null, opacity: node.opacity ?? 1,
      overflow: node.clipsContent ? "hidden" : null, visible: node.visible !== false,
      layoutSizing: { h: node.layoutSizingHorizontal || "FIXED", v: node.layoutSizingVertical || "FIXED" },
      hasImageFill: (node.fills || []).some(f => f.type === "IMAGE"), children: [],
    };
    if (node.children?.length) parsed.children = node.children.filter(c => c.visible !== false).map(c => this.parseNode(c, depth + 1, { x: ax, y: ay }));
    return parsed;
  },
  parseDoc(json) {
    const doc = json.document || json;
    const frames = [];
    for (const page of (doc.children || [])) for (const n of (page.children || [])) if (["FRAME", "COMPONENT", "COMPONENT_SET"].includes(n.type)) frames.push(this.parseNode(n, 0, null));
    const tokens = this.extractTokens(doc);
    return { frames, tokens, meta: { frameCount: frames.length }, rawFrames: (doc.children || []).flatMap(p => (p.children || []).filter(n => ["FRAME", "COMPONENT"].includes(n.type))) };
  },
  extractTokens(doc) {
    const colors = new Map(), fonts = new Set(), sizes = new Set();
    const walk = n => { (n.fills || []).filter(f => f.type === "SOLID" && f.visible !== false).forEach(f => { const k = this.toRgba(f.color); colors.set(k, (colors.get(k) || 0) + 1); }); if (n.style) { if (n.style.fontFamily) fonts.add(n.style.fontFamily); if (n.style.fontSize) sizes.add(n.style.fontSize); } (n.children || []).forEach(walk); };
    (doc.children || []).forEach(p => (p.children || []).forEach(walk));
    return { colors: [...colors.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 20), fonts: [...fonts], fontSizes: [...sizes].sort((a, b) => a - b) };
  }
};

/* ══════════════════════════════════════════════
   HYBRID CODE GENERATOR V4
   Three modes:
   1. CSS-only: reconstruct from Figma props (~85%)
   2. Hybrid: CSS layout + PNG images for visuals (~95%)
   3. Full-image: section screenshots embedded (~100% visual)
══════════════════════════════════════════════ */
const Generator = {
  slug(n) { return "f2e-" + (n || "el").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 38); },
  nodeCSS(node, parentNoLayout = false) {
    const p = {};
    if (node.background && !node.background.startsWith("__IMAGE__")) {
      if (node.background.startsWith("linear-gradient") || node.background.startsWith("radial-gradient")) p.background = node.background;
      else p["background-color"] = node.background;
    }
    if (node.layout) {
      const l = node.layout;
      p.display = "flex"; p["flex-direction"] = l.flexDirection; p["align-items"] = l.alignItems; p["justify-content"] = l.justifyContent;
      if (parseInt(l.gap) > 0) p.gap = l.gap;
      if (l.flexWrap === "wrap") p["flex-wrap"] = "wrap";
      const pad = `${l.pt}px ${l.pr}px ${l.pb}px ${l.pl}px`;
      if (pad !== "0px 0px 0px 0px") p.padding = pad;
    }
    if (!node.layout && node.children?.length) { p.position = "relative"; p.width = `${node.w}px`; p.height = `${node.h}px`; }
    if (parentNoLayout && node.depth > 0) { p.position = "absolute"; p.left = `${node.rx}px`; p.top = `${node.ry}px`; }
    if (node.borderRadius) p["border-radius"] = node.borderRadius;
    if (node.border) p.border = node.border;
    if (node.overflow) p.overflow = node.overflow;
    if (node.opacity < 1) p.opacity = node.opacity.toFixed(2);
    if (node.effects?.boxShadow) p["box-shadow"] = node.effects.boxShadow;
    if (node.effects?.filter) p.filter = node.effects.filter;
    if (node.effects?.backdropFilter) p["backdrop-filter"] = node.effects.backdropFilter;
    if (node.typo) {
      const t = node.typo;
      if (!t.isGrad) p.color = t.color;
      else { p.background = t.color; p["-webkit-background-clip"] = "text"; p["-webkit-text-fill-color"] = "transparent"; p["background-clip"] = "text"; }
      p["font-family"] = `"${t.fontFamily}",sans-serif`; p["font-size"] = `${t.fontSize}px`;
      p["font-weight"] = String(t.fontWeight); p["line-height"] = t.lineHeight;
      if (t.letterSpacing !== "normal") p["letter-spacing"] = t.letterSpacing;
      if (t.textAlign !== "left") p["text-align"] = t.textAlign;
      if (t.textDecoration !== "none") p["text-decoration"] = t.textDecoration;
      if (t.textTransform !== "none") p["text-transform"] = t.textTransform;
      if (t.fontStyle !== "normal") p["font-style"] = t.fontStyle;
    }
    if (node.layoutSizing?.h === "FILL" && node.depth > 0) p.width = "100%";
    if (!node.layout && !node.children?.length && node.w > 0 && node.w < 1400 && !parentNoLayout) p.width = `${node.w}px`;
    if (!node.layout && !node.children?.length && node.h > 0 && node.h < 900) p.height = `${node.h}px`;
    return p;
  },
  walkCSS(node, rules, parentNoLayout = false) {
    const sel = `.${this.slug(node.name)}`;
    const props = this.nodeCSS(node, parentNoLayout);
    if (Object.keys(props).length) rules[sel] = props;
    const thisNoLayout = !node.layout && node.children?.length > 0;
    (node.children || []).forEach(c => this.walkCSS(c, rules, thisNoLayout));
  },
  nodeHTML(node, indent = 0, parentNoLayout = false, imageMap = {}) {
    const pad = "  ".repeat(indent);
    const cls = this.slug(node.name);
    const role = node.role;
    let tag = "div", extra = "";
    if (role === "hero" || role === "section") tag = "section";
    else if (role === "header") tag = "header";
    else if (role === "footer") tag = "footer";
    else if (role === "heading") { const fs = node.typo?.fontSize || 16; tag = fs >= 64 ? "h1" : fs >= 40 ? "h2" : fs >= 28 ? "h3" : "h4"; }
    else if (role === "text" || role === "badge") tag = "p";
    else if (role === "button") { tag = "a"; extra = ` href="#" role="button"`; }
    else if (role === "image") tag = "figure";

    const kids = node.children || [];
    let inner = "";
    // If node has an image render from API, use it
    if (imageMap[node.id]) {
      inner = `\n${pad}  <img src="${imageMap[node.id]}" alt="${node.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">\n${pad}`;
    } else if (node.content) {
      inner = node.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    } else if (role === "image" && !kids.length) {
      inner = `\n${pad}  <img src="images/${node.id}.png" alt="${node.name}" loading="lazy">\n${pad}`;
    } else if (kids.length) {
      const tnl = !node.layout && kids.length > 0;
      inner = "\n" + kids.map(c => this.nodeHTML(c, indent + 1, tnl, imageMap)).join("\n") + "\n" + pad;
    }
    return `${pad}<${tag} class="${cls}"${extra}>${inner}</${tag}>`;
  },
  cssToStr(rules, tokens) {
    const vars = `/* fig2el v4 — Generated HTML+CSS */\n:root {\n${tokens.colors.slice(0, 16).map((c, i) => `  --c${i + 1}: ${c};`).join("\n")}\n${tokens.fonts.map((f, i) => `  --f${i + 1}: "${f}",sans-serif;`).join("\n")}\n  --gutter: 160px;\n  --gutter-md: 48px;\n  --gutter-sm: 20px;\n}\n.f2e-root,.f2e-root *{box-sizing:border-box}\n.f2e-root img{max-width:100%;height:auto;display:block}\n.f2e-root a{color:inherit;text-decoration:none}\n\n`;
    const body = Object.entries(rules).map(([s, p]) => { const b = Object.entries(p).map(([k, v]) => `  ${k}: ${v};`).join("\n"); return b ? `${s} {\n${b}\n}` : null; }).filter(Boolean).join("\n\n");
    const resp = `\n\n/* RESPONSIVE */\n@media(max-width:1024px){[class*="section"],[class*="hero"],[class*="feat"]{padding-left:var(--gutter-md)!important;padding-right:var(--gutter-md)!important}[class*="grid"]{flex-wrap:wrap}}\n@media(max-width:768px){[class*="section"],[class*="hero"],[class*="feat"],[class*="proof"]{padding-left:var(--gutter-sm)!important;padding-right:var(--gutter-sm)!important;padding-top:60px!important;padding-bottom:60px!important}[class*="grid"],[class*="ctas"],[class*="cta-group"]{flex-direction:column!important}[class*="grid"]>*{width:100%!important}}`;
    return vars + body + resp;
  },
  generate(frames, tokens, mode = "hybrid", imageMap = {}) {
    const rules = {};
    let htmlParts;
    if (mode === "full-image") {
      // Each top-level frame is rendered as a full screenshot
      htmlParts = frames.map(f => {
        const imgUrl = imageMap[f.id];
        const cls = this.slug(f.name);
        const bg = f.background || "#050709";
        rules[`.${cls}`] = { background: bg, width: "100%", display: "block", position: "relative" };
        if (imgUrl) return `  <section class="${cls}">\n    <img src="${imgUrl}" alt="${f.name}" style="width:100%;display:block;" loading="lazy">\n  </section>`;
        return `  <section class="${cls}" style="background:${bg};min-height:400px;"></section>`;
      });
    } else {
      htmlParts = frames.map(f => {
        this.walkCSS(f, rules, false);
        // In hybrid mode, pass imageMap so image fills use real PNGs
        return this.nodeHTML(f, 2, false, mode === "hybrid" ? imageMap : {});
      });
    }
    const gf = [...new Set(tokens.fonts.filter(f => !["system-ui", "Arial", "Helvetica"].includes(f)).map(f => f.replace(/ /g, "+")))].map(f => `family=${f}:wght@300;400;500;600;700;800`).join("&");
    const html = `<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>fig2el Export — ${mode}</title>\n  ${gf ? `<link href="https://fonts.googleapis.com/css2?${gf}&display=swap" rel="stylesheet">` : ""}\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="f2e-root">\n${htmlParts.join("\n")}\n  </div>\n</body>\n</html>`;
    const css = this.cssToStr(rules, tokens);
    const previewHtml = frames.map(f => this.nodeHTML(f, 0, false, mode === "hybrid" ? imageMap : {})).join("\n");
    return { html, css, previewHtml };
  }
};

/* ══════════════════════════════════════════════
   ELEMENTOR MAPPER
══════════════════════════════════════════════ */
const Elementor = {
  _c: 0, uid() { return `e${(++this._c).toString(36)}${Math.random().toString(36).slice(2, 5)}`; },
  elType(n) { if (["hero","section","header","footer"].includes(n.role)) return "section"; if (n.layout || ["card","grid","container"].includes(n.role)) return "container"; if (n.role === "button") return "button"; if (n.role === "heading") return "heading"; if (n.role === "image" || n.hasImageFill) return "image"; if (n.figmaType === "TEXT" || n.role === "text") return "text-editor"; return "container"; },
  buildSettings(node, type) {
    const s = {};
    if (node.background && !node.background.startsWith("__IMAGE__")) { if (node.background.startsWith("linear-gradient")) { s.background_background = "gradient"; s.background_gradient_css = node.background; } else { s.background_background = "classic"; s.background_color = node.background; } }
    if (node.layout) { const l = node.layout; s.flex_direction = l.flexDirection; s.align_items = l.alignItems; s.justify_content = l.justifyContent; s.gap = { size: parseInt(l.gap) || 0, unit: "px" }; s.padding = { top: l.pt, right: l.pr, bottom: l.pb, left: l.pl, unit: "px", isLinked: false }; }
    if (node.borderRadius) s.border_radius = { size: parseInt(node.borderRadius) || 0, unit: "px" };
    if (node.border) { s.border_border = "solid"; s.border_color = node.border.split(" ").pop(); }
    if (node.effects?.boxShadow) { s.box_shadow_box_shadow_type = "yes"; s.box_shadow = node.effects.boxShadow; }
    if (node.opacity < 1) s.opacity = { size: node.opacity };
    if (node.typo) { const t = node.typo; s.title_color = t.isGrad ? "#fff" : t.color; s.text_color = t.isGrad ? "#fff" : t.color; s.typography_typography = "custom"; s.typography_font_family = t.fontFamily; s.typography_font_size = { size: t.fontSize, unit: "px" }; s.typography_font_weight = String(t.fontWeight); s.typography_line_height = { size: parseFloat(t.lineHeight) || 1.5, unit: "em" }; s.text_align = t.textAlign; }
    if (node.content) { if (type === "heading") s.title = node.content; else if (type === "button") s.text = node.content; else s.editor = `<p>${node.content.replace(/\n/g, "</p><p>")}</p>`; }
    if (type === "image") s.image = { url: "", alt: node.name };
    return s;
  },
  mapNode(n) { const t = this.elType(n); return { id: this.uid(), elType: t, isInner: n.depth > 0, settings: this.buildSettings(n, t), widgetType: ["section","container"].includes(t) ? undefined : t, elements: (n.children || []).map(c => this.mapNode(c)), _figma: { id: n.id, name: n.name } }; },
  export(frames) { this._c = 0; return { version: "3.24.0", type: "page", title: "fig2el v4 Export", content: frames.map(f => this.mapNode(f)), settings: {}, __globals__: {} }; }
};

/* ══════════════════════════════════════════════
   SYNTAX HIGHLIGHT
══════════════════════════════════════════════ */
const HL = {
  html: c => c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g,'$1<span class="sy-t">$2</span>').replace(/([a-zA-Z-]+)=&quot;([^&]*)&quot;/g,'<span class="sy-a">$1</span>=<span class="sy-s">"$2"</span>').replace(/&quot;/g,'"').replace(/&gt;/g,'<span class="sy-t">&gt;</span>'),
  css:  c => c.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="sy-c">$1</span>').replace(/(:root|@media[^{]*)/g,'<span class="sy-t">$1</span>').replace(/([.][a-zA-Z][\w-]*)/g,'<span class="sy-cl">$1</span>').replace(/([\w-]+)(\s*:)(?![^{]*\{)/g,'<span class="sy-p">$1</span>$2').replace(/:\s*([^;\n{}\\/][^;\n{}]*?)(\s*;)/g,(m,v,e)=>`: <span class="sy-v">${v}</span>${e}`),
  json: c => c.replace(/"([^"]+)":/g,'<span class="sy-p">"$1"</span>:').replace(/:\s*"([^"]*)"/g,': <span class="sy-s">"$1"</span>').replace(/:\s*(-?\d+\.?\d*)/g,': <span class="sy-n">$1</span>').replace(/:\s*(true|false|null)/g,': <span class="sy-k">$1</span>'),
};

/* ══════════════════════════════════════════════
   FIDELITY SCORE
══════════════════════════════════════════════ */
const calcFidelity = (frames, mode) => {
  let pts = 0, tot = 0;
  const walk = n => { tot += 10; if (n.background) pts += 2; if (n.layout) pts += 3; if (n.borderRadius) pts += 1; if (n.effects?.boxShadow) pts += 1; if (n.typo) pts += 2; if (n.border) pts += 1; (n.children || []).forEach(walk); };
  frames.forEach(walk);
  let base = tot > 0 ? Math.round(pts / tot * 100) : 0;
  if (mode === "hybrid") base = Math.min(base + 10, 95);
  if (mode === "full-image") base = 99;
  return base;
};

/* ══════════════════════════════════════════════
   STEP NAVIGATOR
══════════════════════════════════════════════ */
const STEPS = [
  { id: "import",  label: "Import",   icon: "upload" },
  { id: "canvas",  label: "Visuel",   icon: "cursor" },
  { id: "select",  label: "Calques",  icon: "layers" },
  { id: "mode",    label: "Mode",     icon: "mix" },
  { id: "export",  label: "Export",   icon: "export2" },
];
const StepNav = ({ current }) => {
  const ci = STEPS.findIndex(s => s.id === current);
  return (
    <div className="snav">
      {STEPS.map((s, i) => {
        const done = i < ci, active = i === ci;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 25, height: 25, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(34,216,122,.1)" : active ? "rgba(0,232,179,.1)" : "var(--s3)", border: `1px solid ${done ? "rgba(34,216,122,.25)" : active ? "rgba(0,232,179,.3)" : "var(--r1)"}`, transition: "all .3s" }}>
                {done ? <I n="check" s={12} c="var(--em)" /> : <I n={s.icon} s={12} c={active ? "var(--go)" : "var(--f3)"} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: done ? "var(--em)" : active ? "var(--f0)" : "var(--f3)", transition: "all .3s" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < ci ? "rgba(34,216,122,.25)" : "var(--r1)", margin: "0 7px" }} />}
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════ */
const Loader = ({ label, prog }) => (
  <div className="ldr">
    <div className="spin" />
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--fhd)", fontSize: 16, fontWeight: 700, color: "var(--f0)", marginBottom: 10 }}>{label}</p>
      {prog != null && <div className="pg"><div className="pgf" style={{ width: `${prog}%` }} /></div>}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast"><I n="check" s={14} c="var(--em)" /><span style={{ color: "var(--f0)" }}>{msg}</span></div>;
};

/* ══════════════════════════════════════════════
   ROLE TAG
══════════════════════════════════════════════ */
const RTag = ({ node }) => {
  if (node.role === "button") return <span className="tag tb">BTN</span>;
  if (node.role === "image" || node.hasImageFill) return <span className="tag ti">IMG</span>;
  if (node.role === "heading") return <span className="tag th">H</span>;
  if (node.figmaType === "TEXT" || node.role === "text") return <span className="tag tt">TXT</span>;
  return <span className="tag tf">FRM</span>;
};

/* ══════════════════════════════════════════════
   STEP 1 — IMPORT  (URL Figma + démo + JSON)
══════════════════════════════════════════════ */
const StepImport = ({ onImport }) => {
  const [tab, setTab] = useState("url");
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [jsonTxt, setJsonTxt] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const go = useCallback(d => { setLoading(false); onImport(d); }, [onImport]);

  const importFromFigma = async () => {
    const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (!match) { setErr("URL invalide — format : https://www.figma.com/file/XXXXX/Nom"); return; }
    const fileKey = match[1];
    setLoading(true); setErr("");
    try {
      const res = await fetch(`/api/figma/file?fileKey=${fileKey}&token=${encodeURIComponent(token)}&withImages=true`);
      const data = await res.json();
      if (!res.ok) { setErr(data.error || `Erreur ${res.status}`); setLoading(false); return; }
      go(data);
    } catch (e) { setErr("Erreur réseau : " + e.message); setLoading(false); }
  };

  const tryJSON = () => { try { go(JSON.parse(jsonTxt)); } catch { setErr("JSON invalide."); } };

  return (
    <div className="u-up" style={{ maxWidth: 540, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(0,232,179,.06)", border: "1px solid rgba(0,232,179,.16)", borderRadius: 99, marginBottom: 18, fontSize: 11, color: "var(--go)", fontWeight: 700, letterSpacing: ".04em" }}>
          <I n="zap" s={11} c="var(--go)" /> V4 — PREVIEW VISUEL RÉEL + MODE HYBRIDE
        </div>
        <h1 style={{ fontFamily: "var(--fhd)", fontSize: 34, fontWeight: 800, lineHeight: 1.12, marginBottom: 12 }}>
          Connectez votre<br />
          <span style={{ background: "linear-gradient(120deg,var(--go),var(--vi2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fichier Figma</span>
        </h1>
        <p style={{ color: "var(--f2)", fontSize: 14, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
          Entrez votre URL Figma + token pour voir le design réel et sélectionner visuellement les sections à exporter.
        </p>
      </div>

      <div className="tbar" style={{ marginBottom: 18 }}>
        {[["url", "🔗 URL Figma"], ["json", "{ } JSON / Upload"]].map(([id, lbl]) => (
          <button key={id} className={`tbtn ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
        ))}
      </div>

      <div className="pnl" style={{ padding: 26 }}>
        {tab === "url" && (
          <div className="u-fadein" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--f3)", letterSpacing: ".06em" }}>TOKEN FIGMA</label>
              <input value={token} onChange={e => { setToken(e.target.value); setErr(""); }} placeholder="figd_xxxxxxxxxxxxxxxxxxxx" type="password" />
              <span style={{ fontSize: 11, color: "var(--f3)", lineHeight: 1.5 }}>
                Figma → Account Settings → Personal access tokens → Generate new token
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--f3)", letterSpacing: ".06em" }}>URL DU FICHIER FIGMA</label>
              <input value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://www.figma.com/file/XXXXX/Mon-Design" onKeyDown={e => e.key === "Enter" && url && token && importFromFigma()} />
            </div>
            {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7, border: "1px solid rgba(255,92,106,.16)" }}>{err}</div>}
            <div style={{ padding: 11, background: "rgba(0,232,179,.04)", border: "1px solid rgba(0,232,179,.13)", borderRadius: 9, fontSize: 12, color: "var(--go)", lineHeight: 1.55 }}>
              ✓ Le proxy <code style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "0 4px", background: "rgba(0,0,0,.3)", borderRadius: 3 }}>/api/figma/file</code> est actif sur Vercel — plus besoin de backend local.
            </div>
            <button className="btn bp" style={{ width: "100%", height: 44, justifyContent: "center" }} disabled={!url || !token || loading} onClick={importFromFigma}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block", fontSize: 16 }}>⟳</span> Chargement du design…</> : <><I n="link" s={14} /> Importer et visualiser</>}
            </button>
          </div>
        )}
        {tab === "json" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input type="file" accept=".json" ref={fileRef} style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { go(JSON.parse(ev.target.result)); } catch { setErr("Fichier illisible."); } }; r.readAsText(f); }} />
            <button className="btn bs" style={{ width: "100%", height: 48, justifyContent: "center", borderStyle: "dashed" }} onClick={() => fileRef.current.click()}>
              <I n="upload" s={14} /> Uploader un .json Figma
            </button>
            <div style={{ textAlign: "center", color: "var(--f3)", fontSize: 11 }}>— ou collez le JSON —</div>
            <textarea value={jsonTxt} onChange={e => { setJsonTxt(e.target.value); setErr(""); }} placeholder='{"document":{...}}' rows={7} style={{ fontFamily: "var(--fmono)", fontSize: 11, resize: "vertical" }} />
            {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7 }}>{err}</div>}
            <button className="btn bp" style={{ width: "100%", height: 44, justifyContent: "center" }} onClick={tryJSON}>
              <I n="layers" s={14} /> Parser le JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   STEP 2 — VISUAL CANVAS
   Displays real Figma frame thumbnails (from API)
   + overlays for interactive node selection
══════════════════════════════════════════════ */
const StepCanvas = ({ parsed, figmaData, token, onContinue }) => {
  const [selectedFrames, setSelectedFrames] = useState(new Set(parsed.rawFrames?.map(f => f.id) || []));
  const [previews, setPreviewMap] = useState(figmaData.__framePreviews || {});
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeFrame, setActiveFrame] = useState(parsed.rawFrames?.[0] || null);

  // Fetch previews if not already present (e.g., from JSON upload)
  const fetchPreviews = useCallback(async () => {
    if (!token || !figmaData.__fileKey) return;
    const ids = (parsed.rawFrames || []).map(f => f.id).join(",");
    if (!ids) return;
    setLoadingPreviews(true);
    try {
      const r = await fetch(`/api/figma/render?fileKey=${figmaData.__fileKey}&ids=${ids}&scale=1&format=png&token=${encodeURIComponent(token)}`);
      const d = await r.json();
      if (d.images) setPreviewMap(d.images);
    } catch (e) { console.error("Preview fetch failed", e); }
    setLoadingPreviews(false);
  }, [token, figmaData, parsed]);

  const toggleFrame = id => setSelectedFrames(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const selCount = selectedFrames.size;
  const totalFrames = parsed.rawFrames?.length || 0;

  return (
    <div className="u-up" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--fhd)", fontSize: 21, fontWeight: 800, marginBottom: 2 }}>Aperçu du design Figma</h2>
          <p style={{ fontSize: 12, color: "var(--f3)" }}>
            {totalFrames} frame{totalFrames > 1 ? "s" : ""} détectée{totalFrames > 1 ? "s" : ""} · <span style={{ color: "var(--go)", fontWeight: 700 }}>{selCount}</span> sélectionnée{selCount > 1 ? "s" : ""} pour export
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.keys(previews).length === 0 && token && (
            <button className="btn bs" disabled={loadingPreviews} onClick={fetchPreviews} style={{ fontSize: 12 }}>
              {loadingPreviews ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Chargement…</> : <><I n="image" s={13} /> Charger les aperçus</>}
            </button>
          )}
          <button className="btn bp" disabled={selCount === 0} onClick={() => {
            const selFrameIds = new Set([...selectedFrames]);
            const selParsed = { ...parsed, frames: parsed.frames.filter(f => selFrameIds.has(f.id)), selectedFrameIds: selFrameIds, imagePreviews: previews };
            onContinue(selParsed);
          }}>
            Sélectionner les calques <I n="arrow" s={13} />
          </button>
        </div>
      </div>

      {/* Main: frame grid */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {(parsed.rawFrames || parsed.frames || []).length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12, color: "var(--f3)" }}>
            <I n="image" s={36} c="var(--r2)" />
            <p>Aucune frame détectée dans ce fichier Figma</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: 4 }}>
            {(parsed.rawFrames || parsed.frames).map(frame => {
              const isSel = selectedFrames.has(frame.id);
              const previewUrl = previews[frame.id];
              const w = frame.absoluteBoundingBox?.width || frame.w || 1440;
              const h = frame.absoluteBoundingBox?.height || frame.h || 800;
              return (
                <div key={frame.id} className={`frame-thumb ${isSel ? "sel" : ""}`} onClick={() => toggleFrame(frame.id)}>
                  {/* Checkbox indicator */}
                  <div style={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
                    <div className={`chk ${isSel ? "on" : ""}`} style={{ width: 18, height: 18, background: isSel ? "var(--go)" : "rgba(5,7,13,.7)", borderColor: isSel ? "var(--go)" : "rgba(255,255,255,.3)" }}>
                      {isSel && <I n="check" s={10} c="#000" />}
                    </div>
                  </div>
                  {/* Preview image or placeholder */}
                  <div style={{ width: "100%", aspectRatio: `${w}/${Math.min(h, w * 0.7)}`, background: "var(--s3)", position: "relative", overflow: "hidden" }}>
                    {previewUrl ? (
                      <img src={previewUrl} alt={frame.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--f3)" }}>
                        {loadingPreviews ? (
                          <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--r2)", borderTopColor: "var(--go)", animation: "spin .8s linear infinite" }} />
                        ) : (
                          <>
                            <I n="image" s={28} c="var(--r2)" />
                            <span style={{ fontSize: 11 }}>{w} × {h}px</span>
                            {token && <span style={{ fontSize: 10, color: "var(--go)", cursor: "pointer" }} onClick={e => { e.stopPropagation(); fetchPreviews(); }}>Charger l'aperçu →</span>}
                          </>
                        )}
                      </div>
                    )}
                    {/* Overlay on hover/select */}
                    <div style={{ position: "absolute", inset: 0, background: isSel ? "rgba(0,232,179,.08)" : "transparent", transition: "background .15s" }} />
                  </div>
                  {/* Frame info */}
                  <div style={{ padding: "10px 12px", background: "var(--s3)", borderTop: "1px solid var(--r1)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="tag tf" style={{ flexShrink: 0 }}>FRAME</span>
                    <span style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{frame.name}</span>
                    <span style={{ fontSize: 10, color: "var(--f3)", fontFamily: "var(--fmono)", flexShrink: 0 }}>{w}×{h}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "var(--s2)", border: "1px solid var(--r1)", borderRadius: 10, flexShrink: 0 }}>
        <I n="info" s={14} c="var(--f3)" />
        <span style={{ fontSize: 12, color: "var(--f2)", flex: 1 }}>
          Cliquez sur les frames pour les sélectionner/désélectionner. L'étape suivante vous permettra de choisir les calques individuels dans chaque frame.
        </span>
        {!token && <span style={{ fontSize: 11, color: "var(--am)" }}>⚠ Token requis pour charger les aperçus visuels</span>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   STEP 3 — LAYER SELECTION (with checkboxes)
══════════════════════════════════════════════ */
const LayerRow = ({ node, depth, sel, onToggle, activeId, onActivate }) => {
  const [open, setOpen] = useState(depth < 2);
  const hasKids = node.children?.length > 0;
  const selfOn = sel.has(node.id);
  const anyKidOn = hasKids && node.children.some(c => sel.has(c.id));
  const state = selfOn ? "on" : anyKidOn ? "ind" : "off";
  const toggleSub = (n, val) => { onToggle(n.id, val); (n.children || []).forEach(c => toggleSub(c, val)); };
  return (
    <div>
      <div className={`nrow ${activeId === node.id ? "act" : ""}`} style={{ paddingLeft: 6 + depth * 14 }} onClick={() => onActivate(node)}>
        <div className={`chk ${state}`} onClick={e => { e.stopPropagation(); toggleSub(node, state !== "on"); }}>
          {state === "on" && <I n="check" s={9} c="#000" />}
          {state === "ind" && <I n="minus" s={9} c="var(--go)" />}
        </div>
        <span style={{ color: "var(--f3)", fontSize: 10, width: 11, textAlign: "center", cursor: "pointer" }} onClick={e => { e.stopPropagation(); if (hasKids) setOpen(!open); }}>
          {hasKids ? (open ? "▾" : "▸") : "·"}
        </span>
        <RTag node={node} />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11.5, color: "var(--f1)" }}>{node.name}</span>
        {node.hasLayout ? <span className="tag tt" style={{ fontSize: 8, padding: "1px 5px" }}>flex</span> : null}
      </div>
      {open && hasKids && node.children.map(c => <LayerRow key={c.id} node={c} depth={depth + 1} sel={sel} onToggle={onToggle} activeId={activeId} onActivate={onActivate} />)}
    </div>
  );
};

const StepSelect = ({ parsed, onContinue }) => {
  const allIds = useMemo(() => { const s = new Set(); const w = n => { s.add(n.id); (n.children || []).forEach(w); }; parsed.frames.forEach(w); return s; }, [parsed]);
  const [sel, setSel] = useState(() => new Set(allIds));
  const [active, setActive] = useState(parsed.frames[0]);
  const toggle = (id, val) => setSel(prev => { const n = new Set(prev); val ? n.add(id) : n.delete(id); return n; });
  const filterNode = n => { if (!sel.has(n.id)) return null; const k = (n.children || []).map(filterNode).filter(Boolean); return { ...n, children: k }; };
  const selCount = [...allIds].filter(id => sel.has(id)).length;

  return (
    <div className="u-up" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--fhd)", fontSize: 21, fontWeight: 800, marginBottom: 2 }}>Sélection des calques</h2>
          <p style={{ fontSize: 12, color: "var(--f3)" }}><span style={{ color: "var(--go)", fontWeight: 700 }}>{selCount}</span>/{allIds.size} nœuds · Cochez ou décochez selon ce que vous voulez exporter</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn bg" style={{ fontSize: 11 }} onClick={() => setSel(new Set(allIds))}>Tout</button>
          <button className="btn bg" style={{ fontSize: 11 }} onClick={() => setSel(new Set())}>Aucun</button>
          <button className="btn bp" disabled={selCount === 0} onClick={() => {
            const filtered = parsed.frames.map(filterNode).filter(Boolean);
            onContinue({ ...parsed, frames: filtered, selCount });
          }}>
            Choisir le mode <I n="arrow" s={13} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "260px 1fr", gap: 12, minHeight: 0 }}>
        {/* Layer tree */}
        <div className="pnl" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="phd"><I n="layers" s={13} c="var(--f3)" /><span className="plbl">CALQUES ({selCount}/{allIds.size})</span></div>
          <div style={{ flex: 1, overflow: "auto", padding: "4px 0" }}>
            {parsed.frames.map(f => <LayerRow key={f.id} node={f} depth={0} sel={sel} onToggle={toggle} activeId={active?.id} onActivate={setActive} />)}
          </div>
        </div>

        {/* Inspector */}
        <div className="pnl" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="phd"><I n="settings" s={13} c="var(--f3)" /><span className="plbl">INSPECTEUR</span></div>
          {active ? (
            <div style={{ padding: 14, overflow: "auto", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--r1)" }}>
                <RTag node={active} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{active.name}</div>
                  <div style={{ fontSize: 10, color: "var(--f3)", fontFamily: "var(--fmono)" }}>{active.figmaType} · {active.w}×{active.h}px</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {[["Rôle", active.role], ["Layout", active.hasLayout ? "Flex" : "Abs"], ["Fond", active.background || "—"], ["Radius", active.borderRadius || "—"], ["Opacité", active.opacity], ["Enfants", active.children?.length || 0]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--s3)", borderRadius: 7, padding: "8px 10px", border: "1px solid var(--r1)" }}>
                    <div style={{ fontSize: 9, color: "var(--f3)", fontWeight: 700, letterSpacing: ".05em", marginBottom: 3 }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: "var(--f0)", fontFamily: typeof v === "string" && v.startsWith("r") ? "var(--fmono)" : "var(--fui)" }}>
                      {String(v)}
                      {typeof v === "string" && (v.startsWith("#") || v.startsWith("rgb")) && <span style={{ width: 10, height: 10, background: v, display: "inline-block", borderRadius: 2, marginLeft: 4, border: "1px solid var(--r2)", verticalAlign: "middle" }} />}
                    </div>
                  </div>
                ))}
              </div>
              {active.typo && (
                <div style={{ marginTop: 10, background: "var(--s3)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--r1)" }}>
                  <div style={{ fontSize: 9, color: "var(--vi2)", fontWeight: 700, letterSpacing: ".05em", marginBottom: 8 }}>TYPOGRAPHIE</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--f1)", fontFamily: "var(--fmono)" }}>
                    {active.typo.fontFamily} · {active.typo.fontSize}px · {active.typo.fontWeight}
                  </div>
                  {active.content && <div style={{ marginTop: 6, fontSize: 11, color: "var(--f2)", lineHeight: 1.5, fontFamily: "var(--fui)" }}>"{active.content.slice(0, 80)}{active.content.length > 80 ? "…" : ""}"</div>}
                </div>
              )}
              {/* Color preview */}
              {active.background && (
                <div style={{ marginTop: 10, background: "var(--s3)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--r1)" }}>
                  <div style={{ fontSize: 9, color: "var(--f3)", fontWeight: 700, letterSpacing: ".05em", marginBottom: 8 }}>FOND</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 7, background: active.background, border: "1px solid var(--r2)", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontFamily: "var(--fmono)", color: "var(--f2)", wordBreak: "break-all" }}>{active.background}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column", gap: 10, color: "var(--f3)" }}>
              <I n="layers" s={28} c="var(--r2)" /><span style={{ fontSize: 12 }}>Cliquez un calque</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   STEP 4 — MODE SELECTION
   CSS-only | Hybrid CSS+Images | Full-image
══════════════════════════════════════════════ */
const StepMode = ({ parsed, token, onContinue }) => {
  const [mode, setMode] = useState("hybrid");
  const [fetchingImages, setFetchingImages] = useState(false);
  const [imageMap, setImageMap] = useState(parsed.imagePreviews || {});

  const modes = [
    {
      id: "css", icon: "code",
      title: "HTML + CSS pur",
      subtitle: "~85% fidélité",
      desc: "Le CSS est reconstruit depuis les propriétés Figma. Rapide, entièrement éditable. Idéal pour continuer à modifier le code.",
      color: "var(--vi2)",
      pros: ["Code 100% éditable", "Léger et rapide", "Pas de dépendances images"],
      cons: ["Gradients complexes approximés", "Effets visuels non parfaits"],
    },
    {
      id: "hybrid", icon: "mix",
      title: "Hybride CSS + Images",
      subtitle: "~95% fidélité",
      badge: "Recommandé",
      desc: "Structure HTML/CSS pour le layout, les textes et les boutons. Les éléments visuels complexes (fonds, icônes, illustrations) sont exportés en PNG via l'API Figma.",
      color: "var(--go)",
      pros: ["Fidélité visuelle maximale", "Textes et boutons restent éditables", "Responsive natif"],
      cons: ["Nécessite les images PNG Figma", "Fichiers plus lourds"],
    },
    {
      id: "full-image", icon: "image",
      title: "Screenshots complets",
      subtitle: "~99% fidélité visuelle",
      desc: "Chaque section Figma est rendue en PNG haute résolution via l'API. Résultat visuellement parfait mais non éditable comme du vrai code.",
      color: "var(--am)",
      pros: ["Fidélité pixel-perfect", "Résultat identique au design"],
      cons: ["Non éditable en CSS", "Pas adapté à Elementor", "Lourd en bande passante"],
    },
  ];

  const fid = calcFidelity(parsed.frames, mode);
  const fidColor = fid >= 90 ? "var(--em)" : fid >= 75 ? "var(--am)" : "var(--re)";

  const proceed = async () => {
    // For hybrid/full-image modes, try to fetch node renders if we have a token
    if ((mode === "hybrid" || mode === "full-image") && token && Object.keys(imageMap).length === 0) {
      setFetchingImages(true);
      try {
        // Get all frame IDs
        const frameIds = parsed.frames.map(f => f.id).join(",");
        const fileKey = parsed.fileKey;
        if (fileKey && frameIds) {
          const scale = mode === "full-image" ? "2" : "1";
          const res = await fetch(`/api/figma/render?fileKey=${fileKey}&ids=${frameIds}&scale=${scale}&format=png&token=${encodeURIComponent(token)}`);
          const d = await res.json();
          if (d.images) setImageMap(d.images);
        }
      } catch (e) { console.error("Image fetch failed", e); }
      setFetchingImages(false);
    }
    onContinue({ ...parsed, exportMode: mode, imageMap });
  };

  return (
    <div className="u-up" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--fhd)", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Choisissez le mode d'export</h2>
        <p style={{ color: "var(--f2)", fontSize: 13 }}>
          Fidélité estimée pour ce design :&nbsp;
          <span style={{ color: fidColor, fontFamily: "var(--fmono)", fontWeight: 700, fontSize: 14 }}>{fid}%</span>
        </p>
        <div style={{ width: 240, margin: "10px auto 0" }}>
          <div className="fidbar"><div className="fidfl" style={{ width: `${fid}%`, background: fid >= 90 ? "var(--em)" : fid >= 75 ? "var(--am)" : "var(--re)" }} /></div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {modes.map(m => (
          <div key={m.id} className={`mode-card ${mode === m.id ? "on" : ""}`} onClick={() => setMode(m.id)}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `rgba(${m.id === "hybrid" ? "0,232,179" : m.id === "css" ? "123,111,240" : "245,166,35"},.1)`, border: `1px solid rgba(${m.id === "hybrid" ? "0,232,179" : m.id === "css" ? "123,111,240" : "245,166,35"},.2)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <I n={m.icon} s={18} c={m.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--fhd)", fontSize: 15, fontWeight: 700 }}>{m.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: `rgba(${m.id === "hybrid" ? "0,232,179" : m.id === "css" ? "123,111,240" : "245,166,35"},.1)`, color: m.color, border: `1px solid ${m.color}30` }}>
                    {m.subtitle}
                  </span>
                  {m.badge && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(0,232,179,.1)", color: "var(--go)", border: "1px solid rgba(0,232,179,.2)", fontWeight: 700 }}>{m.badge}</span>}
                </div>
                <p style={{ fontSize: 12, color: "var(--f2)", lineHeight: 1.55, marginBottom: 10 }}>{m.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    {m.pros.map((p, i) => <div key={i} style={{ display: "flex", gap: 5, fontSize: 11, color: "var(--em)", marginBottom: 3 }}><I n="check" s={11} c="var(--em)" />{p}</div>)}
                  </div>
                  <div>
                    {m.cons.map((c, i) => <div key={i} style={{ display: "flex", gap: 5, fontSize: 11, color: "var(--f3)", marginBottom: 3 }}><I n="minus" s={11} c="var(--f3)" />{c}</div>)}
                  </div>
                </div>
              </div>
              {mode === m.id && <I n="check" s={18} c="var(--go)" style={{ flexShrink: 0, marginTop: 2 }} />}
            </div>
          </div>
        ))}
      </div>

      <button className="btn bp" style={{ width: "100%", height: 46, justifyContent: "center", fontSize: 14 }} onClick={proceed} disabled={fetchingImages}>
        {fetchingImages ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Chargement des images…</> : <>Générer en mode {modes.find(m2 => m2.id === mode)?.title} <I n="arrow" s={14} /></>}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   STEP 5 — EXPORT  (preview + download)
══════════════════════════════════════════════ */
const LivePreview = ({ html, css }) => {
  const [device, setDevice] = useState("desktop");
  const gf = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&display=swap";
  const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="${gf}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#040609}${css || ""}</style></head><body><div class="f2e-root">${html || ""}</div></body></html>`;
  const w = { desktop: "100%", tablet: "768px", mobile: "390px" };
  return (
    <div style={{ background: "var(--s1)", borderRadius: 14, border: "1px solid var(--r1)", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--r1)", display: "flex", alignItems: "center", gap: 8, background: "var(--s2)", flexShrink: 0 }}>
        <I n="eye" s={13} c="var(--f3)" />
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--f3)", letterSpacing: ".07em", marginRight: 8 }}>PREVIEW LIVE</span>
        {[["desktop", "desktop", "Desktop"], ["tablet", "tablet", "768px"], ["mobile", "mobile", "390px"]].map(([id, ico, lbl]) => (
          <button key={id} className={`dvbtn ${device === id ? "on" : ""}`} onClick={() => setDevice(id)}>
            <I n={ico} s={11} />{lbl}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 12, background: "#040810", display: "flex", justifyContent: "center" }}>
        <iframe srcDoc={doc} style={{ width: w[device], minHeight: "100%", border: "none", borderRadius: 8, transition: "width .3s cubic-bezier(.4,0,.2,1)" }} title="Preview" />
      </div>
    </div>
  );
};

const StepExport = ({ code, parsed }) => {
  const [view, setView] = useState("split");
  const [codeTab, setCodeTab] = useState("html");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const mode = parsed.exportMode || "hybrid";
  const fid = calcFidelity(parsed.frames, mode);

  const dl = (content, name, type = "text/plain") => {
    const b = new Blob([content], { type }); const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: name }).click();
    URL.revokeObjectURL(u); setToast(`${name} téléchargé ✓`);
  };

  const src = codeTab === "html" ? code.html : codeTab === "css" ? code.css : JSON.stringify(code.json, null, 2);
  const highlighted = codeTab === "html" ? HL.html(src?.slice(0, 14000) || "") : codeTab === "css" ? HL.css(src?.slice(0, 14000) || "") : HL.json(src?.slice(0, 14000) || "");

  const modeLabel = { "css": "HTML/CSS pur", "hybrid": "Hybride", "full-image": "Screenshots" }[mode] || mode;
  const fidColor = fid >= 90 ? "var(--em)" : fid >= 75 ? "var(--am)" : "var(--re)";

  return (
    <div className="u-up" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <h2 style={{ fontFamily: "var(--fhd)", fontSize: 21, fontWeight: 800 }}>Code généré</h2>
            <div className="hybadge"><I n="mix" s={11} c="var(--go)" /> {modeLabel}</div>
            <span style={{ fontSize: 12, color: fidColor, fontWeight: 700 }}>{fid}% fidélité</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--f3)" }}>{code.html.split("\n").length}L HTML · {code.css.split("\n").length}L CSS · {(parsed.selCount || "?")} nœuds</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="tbar" style={{ marginBottom: 0 }}>
            {[["split", "Split"], ["preview", "Preview"], ["code", "Code"]].map(([id, lbl]) => (
              <button key={id} className={`tbtn ${view === id ? "on" : ""}`} style={{ padding: "6px 14px" }} onClick={() => setView(id)}>{lbl}</button>
            ))}
          </div>
          <button className="btn bs" onClick={() => dl(code.html, "index.html", "text/html")}><I n="export2" s={13} />HTML</button>
          <button className="btn bs" onClick={() => dl(code.css, "styles.css", "text/css")}><I n="export2" s={13} />CSS</button>
          <button className="btn bp" onClick={() => { dl(code.html, "index.html", "text/html"); setTimeout(() => dl(code.css, "styles.css", "text/css"), 200); setTimeout(() => dl(JSON.stringify(code.json, null, 2), "elementor.json", "application/json"), 400); }}>
            <I n="export2" s={13} /> Tout télécharger
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minHeight: 0, display: "grid", gap: 14, gridTemplateColumns: view === "split" ? "1fr 1fr" : "1fr" }}>
        {(view === "preview" || view === "split") && <LivePreview html={code.previewHtml} css={code.css} />}
        {(view === "code" || view === "split") && (
          <div className="pnl" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--r1)", padding: "0 8px", flexShrink: 0 }}>
              {[["html", "HTML", code.html.split("\n").length], ["css", "CSS", code.css.split("\n").length], ["json", "Elementor JSON", JSON.stringify(code.json, null, 2).split("\n").length]].map(([id, lbl, cnt]) => (
                <button key={id} onClick={() => setCodeTab(id)} style={{ padding: "10px 13px", fontSize: 12, fontWeight: codeTab === id ? 600 : 400, cursor: "pointer", background: "transparent", border: "none", fontFamily: "var(--fui)", color: codeTab === id ? "var(--go)" : "var(--f3)", borderBottom: `2px solid ${codeTab === id ? "var(--go)" : "transparent"}`, transition: "all .15s" }}>
                  {lbl} <span style={{ fontSize: 10, background: "var(--s3)", padding: "1px 5px", borderRadius: 4, color: "var(--f3)" }}>{cnt}</span>
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button className="btn bg" style={{ fontSize: 11, gap: 5, color: copied ? "var(--go)" : "var(--f3)" }} onClick={() => { navigator.clipboard.writeText(src || ""); setCopied(true); setTimeout(() => setCopied(false), 2e3); }}>
                {copied ? <><I n="check" s={12} c="var(--go)" />Copié</> : <><I n="copy" s={12} />Copier</>}
              </button>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "#040610", display: "flex", minHeight: 0 }}>
              <div style={{ padding: "16px 10px 16px 14px", textAlign: "right", color: "var(--f3)", fontSize: 10.5, fontFamily: "var(--fmono)", lineHeight: 1.72, userSelect: "none", borderRight: "1px solid var(--r1)", minWidth: 40, flexShrink: 0 }}>
                {(src || "").split("\n").slice(0, 400).map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <pre style={{ flex: 1, padding: "16px 20px", margin: 0, fontFamily: "var(--fmono)", fontSize: 11.5, lineHeight: 1.72, color: "#c5d0e6", overflow: "visible", whiteSpace: "pre" }}
                dangerouslySetInnerHTML={{ __html: highlighted }} />
            </div>
          </div>
        )}
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
// ImportStep — top-level component (avoids hooks-in-callback violation)
function ImportStep({ onImport: oi, setToken }) {
    const [tab, setTab] = useState("url");
    const [tok, setTok] = useState("");
    const [url, setUrl] = useState("");
    const [jsonTxt, setJsonTxt] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const go = d => { if (setToken) setToken(tok); setLoading(false); oi(d); };
    const importFigma = async () => {
      const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
      if (!match) { setErr("URL invalide"); return; }
      const fileKey = match[1];
      sessionStorage?.setItem?.("fig2el_filekey", fileKey);
      setLoading(true); setErr("");
      try {
        const res = await fetch(`/api/figma/file?fileKey=${fileKey}&token=${encodeURIComponent(tok)}&withImages=true`);
        const data = await res.json();
        if (!res.ok) { setErr(data.error || `Erreur ${res.status}`); setLoading(false); return; }
        data.__fileKey = fileKey;
        go(data);
      } catch (e) { setErr("Erreur réseau : " + e.message); setLoading(false); }
    };
    const tryJSON = () => { try { go(JSON.parse(jsonTxt)); } catch { setErr("JSON invalide."); } };

    return (
      <div className="u-up" style={{ maxWidth: 540, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(0,232,179,.06)", border: "1px solid rgba(0,232,179,.16)", borderRadius: 99, marginBottom: 18, fontSize: 11, color: "var(--go)", fontWeight: 700, letterSpacing: ".04em" }}>
            <I n="zap" s={11} c="var(--go)" /> V4 — PREVIEW VISUEL RÉEL + MODE HYBRIDE
          </div>
          <h1 style={{ fontFamily: "var(--fhd)", fontSize: 34, fontWeight: 800, lineHeight: 1.12, marginBottom: 12 }}>
            Connectez votre<br />
            <span style={{ background: "linear-gradient(120deg,var(--go),var(--vi2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fichier Figma</span>
          </h1>
          <p style={{ color: "var(--f2)", fontSize: 14, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>Entrez votre URL + token pour voir votre design réel et choisir visuellement les sections.</p>
        </div>
        <div className="tbar" style={{ marginBottom: 18 }}>
          {[["url", "🔗 URL Figma"], ["json", "{ } JSON / Upload"]].map(([id, lbl]) => (
            <button key={id} className={`tbtn ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
          ))}
        </div>
        <div className="pnl" style={{ padding: 26 }}>
          {tab === "url" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--f3)", letterSpacing: ".06em" }}>TOKEN FIGMA</label>
                <input value={tok} onChange={e => { setTok(e.target.value); setErr(""); }} placeholder="figd_xxxxxxxxxxxxxxxxxxxx" type="password" />
                <span style={{ fontSize: 11, color: "var(--f3)" }}>Figma → Account Settings → Personal access tokens</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--f3)", letterSpacing: ".06em" }}>URL FIGMA</label>
                <input value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://www.figma.com/file/XXXXX/Mon-Design" onKeyDown={e => e.key === "Enter" && url && tok && importFigma()} />
              </div>
              {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7, border: "1px solid rgba(255,92,106,.16)" }}>{err}</div>}
              <div style={{ padding: 10, background: "rgba(0,232,179,.04)", border: "1px solid rgba(0,232,179,.12)", borderRadius: 8, fontSize: 12, color: "var(--go)" }}>
                ✓ Proxy Vercel actif — <code style={{ fontFamily: "var(--fmono)", fontSize: 10 }}>/api/figma/file</code> contourne le CORS automatiquement.
              </div>
              <button className="btn bp" style={{ width: "100%", height: 44, justifyContent: "center" }} disabled={!url || !tok || loading} onClick={importFigma}>
                {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Import en cours…</> : <><I n="link" s={14} /> Importer et visualiser</>}
              </button>
            </div>
          )}
          {tab === "json" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="file" accept=".json" ref={fileRef} style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { go(JSON.parse(ev.target.result)); } catch { setErr("Fichier illisible."); } }; r.readAsText(f); }} />
              <button className="btn bs" style={{ width: "100%", height: 48, justifyContent: "center", borderStyle: "dashed" }} onClick={() => fileRef.current.click()}><I n="upload" s={14} /> Uploader un .json Figma</button>
              <div style={{ textAlign: "center", color: "var(--f3)", fontSize: 11 }}>— ou collez le JSON —</div>
              <textarea value={jsonTxt} onChange={e => { setJsonTxt(e.target.value); setErr(""); }} placeholder='{"document":{...}}' rows={6} style={{ fontFamily: "var(--fmono)", fontSize: 11, resize: "vertical" }} />
              {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7 }}>{err}</div>}
              <button className="btn bp" style={{ width: "100%", height: 44, justifyContent: "center" }} onClick={tryJSON}><I n="layers" s={14} /> Parser le JSON</button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 20 }}>
          {["Preview visuel réel", "Sélection par clic", "Mode hybride ~95%", "JSON Elementor"].map(f => (
            <span key={f} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--f3)" }}><I n="check" s={11} c="var(--go)" />{f}</span>
          ))}
        </div>
      </div>
    );
}

// ─── Main App ───────────────────────────────────────────────
export default function Fig2elApp() {
  const [step, setStep] = useState("import");
  const [loader, setLoader] = useState(null);
  const [prog, setProg] = useState(0);
  const [rawFigma, setRawFigma] = useState(null);
  const [token, setToken] = useState("");
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modeData, setModeData] = useState(null);
  const [code, setCode] = useState(null);

  const run = useCallback((label, fn, ms = 1200) => {
    setProg(0); setLoader(label);
    const iv = setInterval(() => setProg(p => Math.min(p + 7, 88)), 120);
    setTimeout(() => { clearInterval(iv); setProg(100); setTimeout(() => { fn(); setLoader(null); }, 150); }, ms);
  }, []);

  const onImport = useCallback((data) => {
    data.__fileKey = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("fig2el_filekey") || "" : "";
    setRawFigma(data);
    run("Parsing du design Figma…", () => {
      const p = Parser.parseDoc(data);
      if (data.__framePreviews) p.imagePreviews = data.__framePreviews;
      setParsed(p);
      setStep("canvas");
    }, 1100);
  }, [run]);

  const onCanvasContinue = useCallback((selParsed) => { setSelected(selParsed); setStep("select"); }, []);
  const onSelectContinue = useCallback((filtered) => { setSelected(filtered); setStep("mode"); }, []);
  const onModeContinue = useCallback((mData) => {
    setModeData(mData);
    run("Génération du code…", () => {
      const { html, css, previewHtml } = Generator.generate(mData.frames, mData.tokens, mData.exportMode || "hybrid", mData.imageMap || {});
      const json = Elementor.export(mData.frames);
      setCode({ html, css, previewHtml, json });
      setStep("export");
    }, 1600);
  }, [run]);

  const reset = () => { setStep("import"); setRawFigma(null); setParsed(null); setSelected(null); setModeData(null); setCode(null); };

  return (
    <>
      <style>{CSS}</style>
      {loader && <Loader label={loader} prog={prog} />}

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TopBar */}
        <header style={{ height: 52, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid var(--r1)", background: "var(--s2)", flexShrink: 0, gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,var(--vi),var(--go))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I n="figma" s={14} c="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--fhd)", fontSize: 14, fontWeight: 800, lineHeight: 1 }}>fig<span style={{ color: "var(--go)" }}>2el</span></div>
              <div style={{ fontSize: 8, color: "var(--f3)", letterSpacing: ".08em" }}>FIGMA → ELEMENTOR V4</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}><StepNav current={step} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {step !== "import" && <button className="btn bg" style={{ fontSize: 11 }} onClick={reset}>← Nouveau</button>}
            {parsed && <span style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "3px 9px", background: "var(--s3)", border: "1px solid var(--r1)", borderRadius: 6, color: "var(--f3)" }}>{parsed.meta.frameCount}fr · {parsed.tokens.fonts.join(",")}</span>}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: (step === "import" || step === "mode") ? "40px 28px" : "18px 20px", background: "var(--bg)" }}>
          {step === "import"  && <ImportStep onImport={onImport} setToken={setToken} />}
          {step === "canvas"  && parsed  && <StepCanvas parsed={parsed} figmaData={rawFigma} token={token} onContinue={onCanvasContinue} />}
          {step === "select"  && selected && <StepSelect parsed={selected} onContinue={onSelectContinue} />}
          {step === "mode"    && selected && <StepMode parsed={selected} token={token} onContinue={onModeContinue} />}
          {step === "export"  && code    && <StepExport code={code} parsed={modeData || selected} />}
        </main>

        {/* StatusBar */}
        <div style={{ height: 24, display: "flex", alignItems: "center", padding: "0 16px", borderTop: "1px solid var(--r1)", background: "var(--s2)", gap: 14, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--em)", boxShadow: "0 0 5px var(--em)" }} />
            <span style={{ fontSize: 10, color: "var(--f3)" }}>Prêt</span>
          </div>
          <div style={{ width: 1, height: 12, background: "var(--r1)" }} />
          {code && <span style={{ fontSize: 10, color: "var(--f3)" }}>{code.html.split("\n").length}L HTML · {code.css.split("\n").length}L CSS</span>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 9, color: "var(--f3)", fontFamily: "var(--fmono)" }}>fig2el v4.0 · Hybrid · Elementor 3.24+</span>
        </div>
      </div>
    </>
  );
}
