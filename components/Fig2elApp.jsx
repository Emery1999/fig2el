import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ════════════════════════════════════════════════════════════════
   GLOBAL CSS  ── Dark SaaS / Precision Tooling aesthetic
════════════════════════════════════════════════════════════════ */
const CSS_GLOBAL = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink0:#05070d; --ink1:#090c15; --ink2:#0d1120; --ink3:#111626;
  --ink4:#161c30; --ink5:#1d2438; --ink6:#252e48;
  --rim1:#1e2740; --rim2:#28345a; --rim3:#344070;
  --go:#00e8b3;  --go2:#00c49a; --glow:0 0 32px rgba(0,232,179,.16);
  --vi:#7b6ff0;  --vi2:#a89cf8;
  --re:#ff5c6a;  --am:#f5a623; --em:#22d87a;
  --fg0:#edf0f9; --fg1:#b8c2dc; --fg2:#7a8aaa; --fg3:#44526e;
  --fui:'Inter',sans-serif; --fhd:'Syne',sans-serif; --fmono:'JetBrains Mono',monospace;
  --rad:8px; --rad2:14px; --rad3:22px;
  --trans: all .18s cubic-bezier(.4,0,.2,1);
}
html,body{height:100%;background:var(--ink0);color:var(--fg0);font-family:var(--fui);font-size:14px;line-height:1.55;overflow:hidden}
::selection{background:rgba(0,232,179,.2);color:var(--fg0)}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:var(--rim2);border-radius:99px}
::-webkit-scrollbar-track{background:transparent}

/* ── animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(0,232,179,.4)}50%{box-shadow:0 0 0 6px rgba(0,232,179,0)}}
@keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
@keyframes popIn{0%{opacity:0;transform:scale(.88) translateY(6px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes scan{0%{transform:translateY(0)}100%{transform:translateY(100%)}}

/* ── util classes ── */
.u-fadeup{animation:fadeUp .32s ease forwards}
.u-fadein{animation:fadeIn .22s ease forwards}
.u-popin{animation:popIn .28s cubic-bezier(.34,1.46,.64,1) forwards}

/* ── buttons ── */
.btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--fui);font-size:13px;font-weight:500;cursor:pointer;border:none;border-radius:var(--rad);transition:var(--trans);outline:none;white-space:nowrap;user-select:none}
.btn:disabled{opacity:.35;pointer-events:none}
.btn-prime{background:var(--go);color:#000;font-weight:700;padding:9px 22px;letter-spacing:-.01em}
.btn-prime:hover{background:#00ffcc;box-shadow:var(--glow);transform:translateY(-1px)}
.btn-prime:active{transform:translateY(0)}
.btn-solid{background:var(--ink5);color:var(--fg0);border:1px solid var(--rim1);padding:9px 18px}
.btn-solid:hover{border-color:var(--rim3);background:var(--ink6)}
.btn-ghost{background:transparent;color:var(--fg2);padding:7px 12px;border-radius:var(--rad)}
.btn-ghost:hover{background:var(--ink3);color:var(--fg0)}
.btn-icon{width:30px;height:30px;padding:0;justify-content:center;background:var(--ink4);border:1px solid var(--rim1);border-radius:var(--rad);color:var(--fg2)}
.btn-icon:hover{border-color:var(--rim2);color:var(--fg0)}
.btn-danger{background:rgba(255,92,106,.09);color:var(--re);border:1px solid rgba(255,92,106,.2);padding:7px 14px}
.btn-danger:hover{background:rgba(255,92,106,.16)}

/* ── inputs ── */
input,textarea,select{background:var(--ink3);border:1px solid var(--rim1);color:var(--fg0);border-radius:var(--rad);padding:9px 13px;font-family:var(--fui);font-size:13px;outline:none;transition:border-color .18s,box-shadow .18s;width:100%}
input:focus,textarea:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(0,232,179,.08)}
input::placeholder,textarea::placeholder{color:var(--fg3)}
select option{background:var(--ink3)}

/* ── panels ── */
.panel{background:var(--ink2);border:1px solid var(--rim1);border-radius:var(--rad2);overflow:hidden}
.phead{padding:11px 15px;border-bottom:1px solid var(--rim1);display:flex;align-items:center;gap:8px;flex-shrink:0}
.plabel{font-size:10px;font-weight:700;color:var(--fg3);letter-spacing:.08em}

/* ── tags / badges ── */
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;font-family:var(--fmono);letter-spacing:.04em;white-space:nowrap}
.t-frame{background:rgba(123,111,240,.12);color:#b3acff;border:1px solid rgba(123,111,240,.22)}
.t-text{background:rgba(0,232,179,.09);color:var(--go);border:1px solid rgba(0,232,179,.2)}
.t-img{background:rgba(255,92,106,.09);color:#ff9ea6;border:1px solid rgba(255,92,106,.18)}
.t-btn{background:rgba(245,166,35,.09);color:#ffc55e;border:1px solid rgba(245,166,35,.2)}
.t-head{background:rgba(34,216,122,.09);color:#5fec9e;border:1px solid rgba(34,216,122,.18)}
.t-group{background:rgba(74,82,110,.14);color:var(--fg2);border:1px solid var(--rim1)}
.t-abs{background:rgba(255,92,106,.07);color:var(--re);border:1px solid rgba(255,92,106,.14);font-size:9px}
.t-flex{background:rgba(0,232,179,.07);color:var(--go2);border:1px solid rgba(0,232,179,.14);font-size:9px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.03em}
.b-go{background:rgba(0,232,179,.1);color:var(--go);border:1px solid rgba(0,232,179,.22)}
.b-vi{background:rgba(123,111,240,.12);color:var(--vi2);border:1px solid rgba(123,111,240,.24)}
.b-am{background:rgba(245,166,35,.1);color:var(--am);border:1px solid rgba(245,166,35,.2)}
.b-em{background:rgba(34,216,122,.09);color:var(--em);border:1px solid rgba(34,216,122,.2)}
.b-re{background:rgba(255,92,106,.09);color:var(--re);border:1px solid rgba(255,92,106,.2)}

/* ── checkbox ── */
.chk{width:15px;height:15px;border:1.5px solid var(--rim2);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--trans);cursor:pointer}
.chk.on{background:var(--go);border-color:var(--go)}
.chk.ind{background:rgba(0,232,179,.18);border-color:var(--go)}

/* ── code ── */
.codeblk{background:#040610;border:1px solid var(--rim1);border-radius:var(--rad2);overflow:auto;font-family:var(--fmono);font-size:11.5px;line-height:1.72}
.codeblk pre{padding:18px 20px;color:#c5d0e6;white-space:pre;min-width:max-content}
.sy-k{color:#c792ea} .sy-s{color:#c3e88d} .sy-n{color:#f78c6c}
.sy-c{color:#3d5066;font-style:italic} .sy-p{color:#82aaff}
.sy-v{color:var(--go)} .sy-t{color:#ef9080} .sy-a{color:#ffcb6b}
.sy-cl{color:#80cbc4} .sy-sel{color:#ff9cac}

/* ── node tree ── */
.nrow{display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:6px;cursor:pointer;transition:background .1s;min-height:28px;border:1px solid transparent}
.nrow:hover{background:var(--ink4)}
.nrow.active{background:rgba(0,232,179,.06);border-color:rgba(0,232,179,.16)}

/* ── live preview ── */
.prev-shell{background:var(--ink1);border-radius:var(--rad2);overflow:hidden;display:flex;flex-direction:column;height:100%;border:1px solid var(--rim1)}
.prev-bar{padding:8px 14px;border-bottom:1px solid var(--rim1);display:flex;align-items:center;gap:8px;background:var(--ink2);flex-shrink:0}
.dev-btn{padding:5px 11px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;border:1px solid transparent;color:var(--fg3);font-family:var(--fui);transition:var(--trans);display:flex;align-items:center;gap:5px}
.dev-btn.on{background:var(--ink4);border-color:var(--rim2);color:var(--fg0)}

/* ── fidelity meter ── */
.fidbar{height:4px;background:var(--ink5);border-radius:99px;overflow:hidden;position:relative}
.fidfill{height:100%;border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)}

/* ── export cards ── */
.xcard{background:var(--ink3);border:1px solid var(--rim1);border-radius:var(--rad2);padding:20px;cursor:pointer;transition:var(--trans);position:relative;overflow:hidden}
.xcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,232,179,.05),transparent);opacity:0;transition:opacity .2s}
.xcard:hover{border-color:rgba(0,232,179,.38);transform:translateY(-2px);box-shadow:var(--glow)}
.xcard:hover::before{opacity:1}
.xcard.featured{border-color:rgba(0,232,179,.28)}

/* ── mapping table ── */
.mrow{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px;padding:8px 12px;border-radius:7px;background:var(--ink3);border:1px solid var(--rim1)}

/* ── skeleton ── */
.skel{background:linear-gradient(90deg,var(--ink4) 25%,var(--ink5) 50%,var(--ink4) 75%);background-size:300% 100%;animation:shimmer 1.5s infinite;border-radius:5px}

/* ── tabs ── */
.tabbar{display:flex;gap:2px;padding:3px;background:var(--ink3);border-radius:10px;border:1px solid var(--rim1)}
.tabbtn{flex:1;padding:6px 10px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;background:transparent;border:none;color:var(--fg3);font-family:var(--fui);transition:var(--trans);text-align:center;white-space:nowrap}
.tabbtn.on{background:var(--ink2);color:var(--fg0);box-shadow:0 1px 6px rgba(0,0,0,.35)}

/* ── steps nav ── */
.stepnav{display:flex;align-items:center;gap:0}

/* ── resizer ── */
.rzr{width:5px;background:var(--rim1);cursor:col-resize;flex-shrink:0;position:relative;transition:background .15s}
.rzr:hover{background:var(--go)}
.rzr::after{content:'···';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(90deg);font-size:10px;color:var(--fg3);letter-spacing:3px}

/* ── toast ── */
.toast{position:fixed;bottom:22px;right:22px;padding:10px 16px;border-radius:var(--rad);display:flex;align-items:center;gap:9px;font-size:13px;animation:popIn .25s ease;z-index:9999;border:1px solid var(--rim2);background:var(--ink4);box-shadow:0 8px 32px rgba(0,0,0,.5)}

/* ── loader ── */
.loader-wrap{position:fixed;inset:0;background:rgba(5,7,13,.92);z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;backdrop-filter:blur(10px)}
.spinner{width:52px;height:52px;border-radius:50%;border:2px solid var(--ink6);border-top-color:var(--go);animation:spin .75s linear infinite;position:relative}
.spinner::after{content:'';position:absolute;inset:6px;border-radius:50%;border:2px solid var(--ink5);border-top-color:var(--vi);animation:spin 1.1s linear infinite reverse}
.prog-wrap{width:200px;height:3px;background:var(--ink6);border-radius:99px;overflow:hidden}
.prog-bar{height:100%;background:linear-gradient(90deg,var(--vi),var(--go));border-radius:99px;transition:width .4s ease}
`;

/* ════════════════════════════════════════════════════════════════
   SVG ICON SYSTEM
════════════════════════════════════════════════════════════════ */
const I = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    figma:   "M12 2H8a3 3 0 0 0 0 6h4m0-6h4a3 3 0 0 1 0 6h-4m0-6v6m0 0H8a3 3 0 0 0 0 6h4m0-6h4a3 3 0 0 1 0 6h-4m0-6v6m0 0H8a3 3 0 0 0 0 6h4v-6",
    upload:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    check:   "M20 6L9 17l-5-5",
    x:       "M18 6L6 18M6 6l12 12",
    arrow:   "M5 12h14M12 5l7 7-7 7",
    copy:    "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
    eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    code:    "M16 18l6-6-6-6M8 6l-6 6 6 6",
    export2: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    layers:  "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.93-3c0-.36.03-.71.08-1.05l2.17 1.65c.2.15.25.42.12.63l-2.05 3.55c-.12.22-.38.3-.6.22l-2.56-1.03c-.53.41-1.11.75-1.74.99l-.39 2.72c-.04.24-.25.42-.5.42h-4.1c-.25 0-.46-.18-.5-.42l-.39-2.72c-.63-.24-1.2-.58-1.74-.99l-2.56 1.03c-.22.08-.47 0-.6-.22L3 13.63c-.12-.21-.07-.48.12-.63l2.17-1.65A7.61 7.61 0 0 1 5.07 10c0-.36.03-.71.08-1.05L2.98 7.3c-.2-.15-.25-.42-.12-.63l2.05-3.55c.12-.22.38-.3.6-.22l2.56 1.03c.53-.41 1.11-.75 1.74-.99l.39-2.72C10.24.78 10.45.6 10.7.6h4.1c.25 0 .46.18.5.42l.39 2.72c.63.24 1.2.58 1.74.99l2.56-1.03c.22-.08.47 0 .6.22l2.05 3.55c.12.21.07.48-.12.63l-2.17 1.65c.05.34.08.7.08 1.05z",
    target:  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12A6 6 0 0 1 12 6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    info:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-9v-4m0 7h.01",
    chevD:   "M6 9l6 6 6-6",
    chevR:   "M9 18l6-6-6-6",
    minus:   "M5 12h14",
    plus:    "M12 5v14M5 12h14",
    refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
    desktop: "M2 3h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm8 18h4M12 17v4",
    tablet:  "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 17h.01",
    mobile:  "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 17h.01",
    map:     "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zm6-3v15m6-12v15",
    lock:    "M7 11V7a5 5 0 0 1 10 0v4M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z",
    link:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    hash:    "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
    cpu:     "M9 3H5a2 2 0 0 0-2 2v4m6-6h6m-6 0v18m6-18h4a2 2 0 0 1 2 2v4m-6-6v18M3 9h18M3 15h18m-18 3v3a2 2 0 0 0 2 2h4m12-5v3a2 2 0 0 1-2 2h-4",
    wand:    "M15 4l5 5-11 11-5-1-1-5L15 4zm-4 8l1.5 1.5M7 14l.5.5M10 7l1.5 1.5",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }}>
      <path d={paths[n] || ""} />
    </svg>
  );
};

/* ════════════════════════════════════════════════════════════════
   DEMO FIGMA DATA  ── Rich multi-section landing page
════════════════════════════════════════════════════════════════ */
const DEMO_FIGMA = { document: { id: "0:0", name: "Doc", type: "DOCUMENT", children: [{ id: "p1", name: "Landing", type: "CANVAS", children: [
  /* HERO ──────────────────────────────────────────────────── */
  { id: "hero", name: "Hero Section", type: "FRAME",
    layoutMode: "VERTICAL", primaryAxisAlignItems: "CENTER", counterAxisAlignItems: "CENTER",
    absoluteBoundingBox: { x:0, y:0, w:1440, width:1440, height:760 },
    fills: [{ type:"SOLID", color:{r:.04,g:.05,b:.09}, visible:true }],
    paddingTop:110, paddingBottom:110, paddingLeft:160, paddingRight:160, itemSpacing:26,
    clipsContent: false,
    children: [
      { id:"hero-badge", name:"Badge Pill", type:"FRAME",
        layoutMode:"HORIZONTAL", itemSpacing:8, cornerRadius:99,
        paddingTop:6, paddingBottom:6, paddingLeft:16, paddingRight:16,
        absoluteBoundingBox:{x:570,y:150,w:300,width:300,height:32},
        fills:[{type:"SOLID",color:{r:0,g:.91,b:.7,a:.1},visible:true}],
        strokes:[{type:"SOLID",color:{r:0,g:.91,b:.7,a:.3}}], strokeWeight:1,
        children:[{id:"badge-t",name:"Badge Text",type:"TEXT",
          absoluteBoundingBox:{x:594,y:157,width:252,height:18},
          characters:"✦  fig2el v3 — Fidélité maximale",
          style:{fontFamily:"Inter",fontSize:13,fontWeight:500,
            fills:[{type:"SOLID",color:{r:0,g:.91,b:.7,a:1}}]}}] },
      { id:"hero-h1", name:"Hero H1", type:"TEXT",
        absoluteBoundingBox:{x:160,y:198,width:1120,height:196},
        characters:"Design Figma → Code\nElementor Pixel-Perfect",
        style:{fontFamily:"Syne",fontSize:80,fontWeight:800,textAlignHorizontal:"CENTER",
          lineHeightPx:92,
          fills:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:1}}]} },
      { id:"hero-sub", name:"Hero Subtitle", type:"TEXT",
        absoluteBoundingBox:{x:320,y:412,width:800,height:64},
        characters:"Sélectionnez vos calques, obtenez un HTML pixel-perfect avec positionnement absolu,\nCSS optimisé, design tokens et JSON Elementor prêt pour WordPress.",
        style:{fontFamily:"Inter",fontSize:17,fontWeight:400,textAlignHorizontal:"CENTER",
          lineHeightPx:28,
          fills:[{type:"SOLID",color:{r:.6,g:.67,b:.82,a:1}}]} },
      { id:"hero-ctas", name:"Hero CTAs", type:"FRAME",
        layoutMode:"HORIZONTAL", itemSpacing:12, primaryAxisAlignItems:"CENTER",
        absoluteBoundingBox:{x:516,y:508,width:408,height:52},
        fills:[],
        children:[
          { id:"cta-p", name:"Primary Button", type:"FRAME",
            layoutMode:"HORIZONTAL", cornerRadius:10,
            paddingTop:15, paddingBottom:15, paddingLeft:34, paddingRight:34,
            absoluteBoundingBox:{x:516,y:508,width:224,height:52},
            fills:[{type:"SOLID",color:{r:0,g:.91,b:.7,a:1},visible:true}],
            effects:[{type:"DROP_SHADOW",offset:{x:0,y:8},radius:24,spread:0,color:{r:0,g:.91,b:.7,a:.28},visible:true}],
            children:[{id:"cta-p-t",name:"CTA Primary Label",type:"TEXT",
              characters:"Convertir maintenant",
              style:{fontFamily:"Inter",fontSize:15,fontWeight:700,
                fills:[{type:"SOLID",color:{r:0,g:0,b:0,a:1}}]}}] },
          { id:"cta-s", name:"Ghost Button", type:"FRAME",
            layoutMode:"HORIZONTAL", cornerRadius:10,
            paddingTop:15, paddingBottom:15, paddingLeft:28, paddingRight:28,
            absoluteBoundingBox:{x:752,y:508,width:172,height:52},
            fills:[{type:"SOLID",color:{r:.08,g:.1,b:.16,a:1},visible:true}],
            strokes:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:.15}}], strokeWeight:1,
            children:[{id:"cta-s-t",name:"CTA Ghost Label",type:"TEXT",
              characters:"Voir la démo →",
              style:{fontFamily:"Inter",fontSize:15,fontWeight:500,
                fills:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:1}}]}}] }
        ] },
      { id:"hero-metrics", name:"Metrics Row", type:"FRAME",
        layoutMode:"HORIZONTAL", itemSpacing:56, primaryAxisAlignItems:"CENTER",
        absoluteBoundingBox:{x:452,y:598,width:536,height:62},
        fills:[],
        children:[
          ...[ ["98%","Fidélité visuelle",{r:0,g:.91,b:.7}], ["<60s","Temps moyen",{r:.93,g:.94,b:.98}], ["5k+","Designers",{r:.93,g:.94,b:.98}] ].map(([v,l,c],i)=>({
            id:`m${i}`, name:`Metric ${i}`, type:"FRAME",
            layoutMode:"VERTICAL", itemSpacing:3, counterAxisAlignItems:"CENTER",
            absoluteBoundingBox:{x:452+i*178,y:598,width:120,height:62},
            fills:[],
            children:[
              {id:`mv${i}`,name:"Metric Val",type:"TEXT",characters:v,
               style:{fontFamily:"Syne",fontSize:26,fontWeight:800,fills:[{type:"SOLID",color:{...c,a:1}}]}},
              {id:`ml${i}`,name:"Metric Label",type:"TEXT",characters:l,
               style:{fontFamily:"Inter",fontSize:12,fontWeight:400,textAlignHorizontal:"CENTER",fills:[{type:"SOLID",color:{r:.6,g:.67,b:.82,a:1}}]}}
            ]
          }))
        ] }
    ] },
  /* FEATURES ──────────────────────────────────────────────── */
  { id:"feat", name:"Features Section", type:"FRAME",
    layoutMode:"VERTICAL", primaryAxisAlignItems:"CENTER", counterAxisAlignItems:"CENTER",
    absoluteBoundingBox:{x:0,y:760,width:1440,height:640},
    fills:[{type:"GRADIENT_LINEAR",
      gradientHandlePositions:[{x:.5,y:0},{x:.5,y:1},{x:1,y:0}],
      gradientStops:[
        {position:0,color:{r:.055,g:.063,b:.094,a:1}},
        {position:1,color:{r:.04,g:.05,b:.09,a:1}},
      ],visible:true}],
    paddingTop:100, paddingBottom:100, paddingLeft:160, paddingRight:160, itemSpacing:60,
    children:[
      { id:"feat-title", name:"Features Title", type:"TEXT",
        absoluteBoundingBox:{x:400,y:860,width:640,height:54},
        characters:"Moteur de conversion v3",
        style:{fontFamily:"Syne",fontSize:42,fontWeight:800,textAlignHorizontal:"CENTER",
          fills:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:1}}]} },
      { id:"feat-grid", name:"Features Grid", type:"FRAME",
        layoutMode:"HORIZONTAL", itemSpacing:18, counterAxisAlignItems:"STRETCH",
        absoluteBoundingBox:{x:160,y:964,width:1120,height:296},
        fills:[],
        children:[
          ...[ ["🔍","Parsing Pro","Détection Auto Layout, position absolue, gradients, effets, variables. Support INSTANCE et COMPONENT.",{r:0,g:.91,b:.7}],
               ["⚡","High Fidelity","Conversion directe propriété Figma → CSS avec dual mode Flex + Absolu pour coller au design original.",{r:.48,g:.44,b:.94}],
               ["🎯","Layer Select","Arbre interactif tri-state. Choisissez précisément ce que vous exportez, nœud par nœud.",{r:.96,g:.65,b:.27}],
               ["📡","API Réelle","Backend Express intégré. Fetch direct depuis l'API Figma v1 avec token + images assets.",{r:.13,g:.85,b:.48}],
          ].map(([ico,t,d,c],i)=>({
            id:`fc${i}`, name:`Feature Card ${i+1}`, type:"FRAME",
            layoutMode:"VERTICAL", itemSpacing:14,
            paddingTop:28, paddingBottom:28, paddingLeft:24, paddingRight:24, cornerRadius:14,
            absoluteBoundingBox:{x:160+i*277,y:964,width:259,height:296},
            fills:[{type:"SOLID",color:{r:.077,g:.086,b:.125,a:1},visible:true}],
            strokes:[{type:"SOLID",color:{...c,a:.15}}], strokeWeight:1,
            children:[
              {id:`fi${i}`,name:"Feature Icon",type:"TEXT",characters:ico,
               style:{fontFamily:"Inter",fontSize:30,fontWeight:400,fills:[{type:"SOLID",color:{...c,a:1}}]}},
              {id:`ft${i}`,name:"Feature Title",type:"TEXT",characters:t,
               style:{fontFamily:"Syne",fontSize:18,fontWeight:700,
                 fills:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:1}}]}},
              {id:`fd${i}`,name:"Feature Desc",type:"TEXT",characters:d,
               style:{fontFamily:"Inter",fontSize:13,fontWeight:400,lineHeightPx:20,
                 fills:[{type:"SOLID",color:{r:.6,g:.67,b:.82,a:1}}]}}
            ]
          }))
        ] }
    ] },
  /* PROOF ─────────────────────────────────────────────────── */
  { id:"proof", name:"Proof Section", type:"FRAME",
    layoutMode:"VERTICAL", primaryAxisAlignItems:"CENTER", counterAxisAlignItems:"CENTER",
    absoluteBoundingBox:{x:0,y:1400,width:1440,height:320},
    fills:[{type:"SOLID",color:{r:.04,g:.05,b:.09,a:1},visible:true}],
    paddingTop:80, paddingBottom:80, paddingLeft:160, paddingRight:160, itemSpacing:44,
    children:[
      { id:"proof-t", name:"Proof Title", type:"TEXT",
        absoluteBoundingBox:{x:380,y:1480,width:680,height:52},
        characters:"Prêt à transformer vos designs ?",
        style:{fontFamily:"Syne",fontSize:40,fontWeight:800,textAlignHorizontal:"CENTER",
          fills:[{type:"SOLID",color:{r:.93,g:.94,b:.98,a:1}}]} },
      { id:"proof-cta", name:"Proof CTA", type:"FRAME",
        layoutMode:"HORIZONTAL",
        paddingTop:16, paddingBottom:16, paddingLeft:44, paddingRight:44, cornerRadius:12,
        absoluteBoundingBox:{x:572,y:1550,width:296,height:56},
        fills:[{type:"SOLID",color:{r:0,g:.91,b:.7,a:1},visible:true}],
        children:[{id:"proof-cta-t",name:"Proof CTA Label",type:"TEXT",
          characters:"Démarrer maintenant — Gratuit",
          style:{fontFamily:"Inter",fontSize:15,fontWeight:700,
            fills:[{type:"SOLID",color:{r:0,g:0,b:0,a:1}}]}}] }
    ] }
] }] }, styles:{}, componentSets:{} };

/* ════════════════════════════════════════════════════════════════
   ① PARSER V3 — Maximum Fidelity
   Key innovations:
   - Dual mode: layoutMode → Flex, no layoutMode → Absolute positioning
   - Complete gradient support (linear angles from handles)
   - All fill types + image fills
   - Full effect pipeline: shadows, blurs, bg-blur
   - Blend modes → CSS mix-blend-mode
   - Precise constraints mapping
════════════════════════════════════════════════════════════════ */
const Parser = {
  /* ── color utils ── */
  toRgba(c, alpha = 1) {
    if (!c) return "transparent";
    const r = Math.round((c.r || 0) * 255);
    const g = Math.round((c.g || 0) * 255);
    const b = Math.round((c.b || 0) * 255);
    const a = ((c.a ?? 1) * alpha);
    return a >= .995 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a.toFixed(3)})`;
  },

  gradientAngle(handles) {
    if (!handles || handles.length < 2) return 135;
    const dx = handles[1].x - handles[0].x;
    const dy = handles[1].y - handles[0].y;
    return Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360;
  },

  parseFills(node) {
    const fills = (node.fills || []).filter(f => f.visible !== false);
    if (!fills.length) return null;
    const results = [];
    for (const f of fills.slice().reverse()) {
      if (f.type === "SOLID") {
        results.push(this.toRgba(f.color, f.opacity ?? 1));
      } else if (f.type === "GRADIENT_LINEAR") {
        const angle = this.gradientAngle(f.gradientHandlePositions);
        const stops = (f.gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
        results.push(`linear-gradient(${angle}deg,${stops})`);
      } else if (f.type === "GRADIENT_RADIAL") {
        const stops = (f.gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
        results.push(`radial-gradient(ellipse at center,${stops})`);
      } else if (f.type === "GRADIENT_ANGULAR") {
        const stops = (f.gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
        results.push(`conic-gradient(${stops})`);
      } else if (f.type === "IMAGE") {
        results.push(`url('placeholder-image.jpg')`);
      }
    }
    return results.length === 1 ? results[0] : results.join(", ") || null;
  },

  parseBg(node) {
    if (node.backgroundColor) {
      const bg = this.toRgba(node.backgroundColor);
      if (bg !== "transparent" && bg !== "rgb(0,0,0)") return bg;
    }
    return this.parseFills(node);
  },

  parseTypo(node) {
    const s = node.style || {};
    const fills = (node.fills || []).filter(f => f.visible !== false);
    let color = "#ffffff";
    if (fills[0]?.type === "SOLID") color = this.toRgba(fills[0].color, fills[0].opacity ?? 1);
    else if (fills[0]?.type === "GRADIENT_LINEAR") {
      const angle = this.gradientAngle(fills[0].gradientHandlePositions);
      const stops = (fills[0].gradientStops || []).map(s => `${this.toRgba(s.color)} ${Math.round(s.position * 100)}%`).join(",");
      color = `linear-gradient(${angle}deg,${stops})`;
    }
    return {
      fontFamily: s.fontFamily || "inherit",
      fontSize: s.fontSize || 16,
      fontWeight: s.fontWeight || 400,
      lineHeight: s.lineHeightPx ? `${s.lineHeightPx}px` : s.lineHeightPercent ? `${(s.lineHeightPercent / 100).toFixed(2)}` : "1.5",
      letterSpacing: s.letterSpacing ? `${s.letterSpacing.toFixed(3)}px` : "normal",
      textAlign: (s.textAlignHorizontal || "LEFT").toLowerCase(),
      color,
      isGradientText: color.startsWith("linear-gradient") || color.startsWith("radial-gradient"),
      textDecoration: s.textDecoration === "UNDERLINE" ? "underline" : s.textDecoration === "STRIKETHROUGH" ? "line-through" : "none",
      textTransform: s.textCase === "UPPER" ? "uppercase" : s.textCase === "LOWER" ? "lowercase" : s.textCase === "TITLE" ? "capitalize" : "none",
      fontStyle: s.italic ? "italic" : "normal",
      paragraphSpacing: s.paragraphSpacing || 0,
    };
  },

  parseLayout(node) {
    if (!node.layoutMode) return null;
    const horiz = node.layoutMode === "HORIZONTAL";
    return {
      display: "flex",
      flexDirection: horiz ? "row" : "column",
      alignItems: this.axisMap(node.counterAxisAlignItems),
      justifyContent: this.axisMap(node.primaryAxisAlignItems),
      gap: `${node.itemSpacing || 0}px`,
      flexWrap: node.layoutWrap === "WRAP" ? "wrap" : "nowrap",
      pt: node.paddingTop || 0,
      pr: node.paddingRight || 0,
      pb: node.paddingBottom || 0,
      pl: node.paddingLeft || 0,
    };
  },

  axisMap(v) {
    return { MIN: "flex-start", CENTER: "center", MAX: "flex-end", SPACE_BETWEEN: "space-between", SPACE_AROUND: "space-around", BASELINE: "baseline" }[v] || "flex-start";
  },

  parseEffects(node) {
    const efs = (node.effects || []).filter(e => e.visible !== false);
    const shadows = efs.filter(e => e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW");
    const layerBlurs = efs.filter(e => e.type === "LAYER_BLUR");
    const bgBlurs = efs.filter(e => e.type === "BACKGROUND_BLUR");
    return {
      boxShadow: shadows.map(s => {
        const ins = s.type === "INNER_SHADOW" ? "inset " : "";
        return `${ins}${s.offset?.x || 0}px ${s.offset?.y || 0}px ${s.radius || 0}px ${s.spread || 0}px ${this.toRgba(s.color, s.opacity ?? 1)}`;
      }).join(", ") || null,
      filter: layerBlurs[0] ? `blur(${layerBlurs[0].radius}px)` : null,
      backdropFilter: bgBlurs[0] ? `blur(${bgBlurs[0].radius}px)` : null,
    };
  },

  parseBorder(node) {
    const ss = (node.strokes || []).filter(s => s.visible !== false);
    if (!ss.length) return null;
    const color = this.toRgba(ss[0].color, ss[0].opacity ?? 1);
    const w = node.strokeWeight || 1;
    const style = node.dashPattern?.length ? "dashed" : "solid";
    const pos = node.strokeAlign === "INSIDE" ? "inset 0 0 0" : null;
    if (pos) return { boxShadow: `${pos} ${w}px ${color}`, synthetic: true };
    return { border: `${w}px ${style} ${color}` };
  },

  parseRadius(node) {
    if (node.cornerRadius != null && node.cornerRadius > 0) return `${node.cornerRadius}px`;
    const r = node.rectangleCornerRadii;
    if (r && r.some(v => v > 0)) return r.map(v => `${v || 0}px`).join(" ");
    return null;
  },

  parseBlend(node) {
    const map = { MULTIPLY: "multiply", SCREEN: "screen", OVERLAY: "overlay", DARKEN: "darken", LIGHTEN: "lighten", COLOR_DODGE: "color-dodge", COLOR_BURN: "color-burn", HARD_LIGHT: "hard-light", SOFT_LIGHT: "soft-light", DIFFERENCE: "difference", EXCLUSION: "exclusion", HUE: "hue", SATURATION: "saturation", COLOR: "color", LUMINOSITY: "luminosity" };
    return map[node.blendMode] || null;
  },

  detectRole(node) {
    const n = (node.name || "").toLowerCase();
    if (n.match(/^hero|^banner|hero[-_]/)) return "hero";
    if (n.match(/section|block|wrapper|^page/)) return "section";
    if (n.match(/^nav|^header|topbar|navbar/)) return "header";
    if (n.match(/^footer|bottombar/)) return "footer";
    if (n.match(/card|feature|item[-_]|[-_]item/)) return "card";
    if (n.match(/btn|button|cta[-_]|[-_]cta/)) return "button";
    if (n.match(/img|image|photo|thumb|picture|cover/)) return "image";
    if (n.match(/icon|ico[-_]|[-_]ico/)) return "icon";
    if (n.match(/badge|pill|tag[-_]|chip/)) return "badge";
    if (n.match(/grid[-_]|[-_]grid|columns|row[-_]/)) return "grid";
    if (n.match(/h1|h2|h3|heading|title[-_]|[-_]title|headline/)) return "heading";
    if (n.match(/desc|subtitle|subtext|body[-_]|paragraph|caption|label/)) return "text";
    if (n.match(/stat|metric|number[-_]|count/)) return "stat";
    if (n.match(/divider|separator|hr[-_]/)) return "divider";
    if (node.type === "TEXT") {
      const s = node.style || {};
      if (s.fontSize >= 36) return "heading";
      if (s.fontWeight >= 700 && s.fontSize >= 18) return "heading";
      return "text";
    }
    return "container";
  },

  parseNode(node, depth = 0, parentBB = null) {
    const bb = node.absoluteBoundingBox || {};
    const w = Math.round(bb.width || bb.w || 0);
    const h = Math.round(bb.height || bb.h || 0);
    const ax = Math.round(bb.x || 0);
    const ay = Math.round(bb.y || 0);
    const rx = parentBB ? ax - Math.round(parentBB.x || 0) : 0;
    const ry = parentBB ? ay - Math.round(parentBB.y || 0) : 0;

    const layout = this.parseLayout(node);
    const effects = this.parseEffects(node);
    const borderInfo = this.parseBorder(node);

    const parsed = {
      id: node.id, name: node.name, figmaType: node.type,
      role: this.detectRole(node),
      depth, w, h, ax, ay, rx, ry,
      hasLayout: !!layout,
      layout,
      background: this.parseBg(node),
      fills: node.fills || [],
      effects,
      border: borderInfo?.border || null,
      borderShadow: borderInfo?.boxShadow || null,
      borderRadius: this.parseRadius(node),
      typo: node.type === "TEXT" ? this.parseTypo(node) : null,
      content: node.characters || null,
      opacity: node.opacity ?? 1,
      blendMode: this.parseBlend(node),
      overflow: node.clipsContent ? "hidden" : null,
      visible: node.visible !== false,
      layoutSizing: { h: node.layoutSizingHorizontal || "FIXED", v: node.layoutSizingVertical || "FIXED" },
      constraints: node.constraints || { horizontal: "LEFT", vertical: "TOP" },
      isMask: node.isMask || false,
      children: [],
    };

    if (node.children?.length) {
      parsed.children = node.children
        .filter(c => c.visible !== false)
        .map(c => this.parseNode(c, depth + 1, { x: ax, y: ay, w, h }));
    }
    return parsed;
  },

  parseDoc(json) {
    const doc = json.document || json;
    const frames = [];
    for (const page of (doc.children || [])) {
      for (const n of (page.children || [])) {
        if (["FRAME", "COMPONENT", "COMPONENT_SET", "INSTANCE"].includes(n.type)) {
          frames.push(this.parseNode(n, 0, null));
        }
      }
    }
    return { frames, tokens: this.extractTokens(doc), meta: { frameCount: frames.length } };
  },

  extractTokens(doc) {
    const colors = new Map(), fonts = new Set(), sizes = new Set(), weights = new Set();
    const walk = n => {
      (n.fills || []).filter(f => f.type === "SOLID" && f.visible !== false).forEach(f => {
        const k = this.toRgba(f.color); colors.set(k, (colors.get(k) || 0) + 1);
      });
      if (n.style) {
        if (n.style.fontFamily) fonts.add(n.style.fontFamily);
        if (n.style.fontSize) sizes.add(n.style.fontSize);
        if (n.style.fontWeight) weights.add(n.style.fontWeight);
      }
      (n.children || []).forEach(walk);
    };
    (doc.children || []).forEach(p => (p.children || []).forEach(walk));
    const sortedColors = [...colors.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
    return { colors: sortedColors.slice(0, 24), fonts: [...fonts], fontSizes: [...sizes].sort((a, b) => a - b), fontWeights: [...weights].sort((a, b) => a - b) };
  }
};

/* ════════════════════════════════════════════════════════════════
   ② CODE GENERATOR V3 — High-Fidelity HTML + CSS
   Strategy:
   - layoutMode → display:flex (preserves design intent)
   - no layoutMode + has children → position:relative, children are absolute
   - no layoutMode + leaf → position:absolute (within parent)
   - Text with gradient fill → webkit gradient text technique
   - Complete property mapping including blend, overflow, filter
════════════════════════════════════════════════════════════════ */
const Generator = {
  slugify(name) {
    return "f2e-" + (name || "el").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  },

  nodeToCSS(node) {
    const p = {};

    // Background
    if (node.background) {
      const bg = node.background;
      if (bg.startsWith("linear-gradient") || bg.startsWith("radial-gradient") || bg.startsWith("conic-gradient")) p.background = bg;
      else if (bg.startsWith("url(")) p["background-image"] = bg;
      else p["background-color"] = bg;
    }

    // Layout mode → flexbox
    if (node.layout) {
      const l = node.layout;
      p.display = "flex";
      p["flex-direction"] = l.flexDirection;
      p["align-items"] = l.alignItems;
      p["justify-content"] = l.justifyContent;
      if (parseInt(l.gap) > 0) p.gap = l.gap;
      if (l.flexWrap === "wrap") p["flex-wrap"] = "wrap";
      const pad = `${l.pt}px ${l.pr}px ${l.pb}px ${l.pl}px`;
      if (pad !== "0px 0px 0px 0px") p.padding = pad;
    }

    // Non-layout with children → relative container
    if (!node.layout && node.children?.length > 0) {
      p.position = "relative";
      if (node.w > 0) p.width = `${node.w}px`;
      if (node.h > 0) p.height = `${node.h}px`;
    }

    // Absolute leaf positioning (inside non-layout parent)
    // This is applied via a separate pass in the HTML generator

    // Dimensions for flex items
    if (node.layout) {
      if (node.layoutSizing?.h === "FILL") p.width = "100%";
      if (node.layoutSizing?.v === "FILL") p.height = "100%";
    }

    // Width/height for fixed-size flex items or absolute items
    if (!node.layout && (!node.children?.length)) {
      if (node.w > 0 && node.w < 1300) p.width = `${node.w}px`;
      if (node.h > 0 && node.h < 900) p.height = `${node.h}px`;
    }

    // Visual properties
    if (node.borderRadius) p["border-radius"] = node.borderRadius;
    if (node.border) p.border = node.border;
    if (node.overflow) p.overflow = node.overflow;
    if (node.opacity < 1) p.opacity = node.opacity.toFixed(2);
    if (node.blendMode) p["mix-blend-mode"] = node.blendMode;

    // Effects
    const shadows = [];
    if (node.effects?.boxShadow) shadows.push(node.effects.boxShadow);
    if (node.borderShadow) shadows.push(node.borderShadow);
    if (shadows.length) p["box-shadow"] = shadows.join(", ");
    if (node.effects?.filter) p.filter = node.effects.filter;
    if (node.effects?.backdropFilter) p["backdrop-filter"] = node.effects.backdropFilter;

    // Typography
    if (node.typo) {
      const t = node.typo;
      if (!t.isGradientText) p.color = t.color;
      p["font-family"] = `"${t.fontFamily}", sans-serif`;
      p["font-size"] = `${t.fontSize}px`;
      p["font-weight"] = String(t.fontWeight);
      p["line-height"] = t.lineHeight;
      if (t.letterSpacing !== "normal") p["letter-spacing"] = t.letterSpacing;
      if (t.textAlign !== "left") p["text-align"] = t.textAlign;
      if (t.textDecoration !== "none") p["text-decoration"] = t.textDecoration;
      if (t.textTransform !== "none") p["text-transform"] = t.textTransform;
      if (t.fontStyle !== "normal") p["font-style"] = t.fontStyle;
      if (t.isGradientText) {
        p["background"] = t.color;
        p["-webkit-background-clip"] = "text";
        p["-webkit-text-fill-color"] = "transparent";
        p["background-clip"] = "text";
      }
    }

    return p;
  },

  cssToStr(rules, tokens) {
    const varBlock = `/* ─────────────────────────────────────────
   Generated by fig2el v3 — figma-to-elementor
   ───────────────────────────────────────── */

/* ── Design Tokens ── */
:root {
${tokens.colors.slice(0, 16).map((c, i) => `  --f2e-c${i + 1}: ${c};`).join("\n")}
${tokens.fonts.map((f, i) => `  --f2e-f${i + 1}: "${f}", sans-serif;`).join("\n")}
${tokens.fontSizes.map(s => `  --f2e-fs-${s}: ${s}px;`).join("\n")}
  --f2e-gutter: 160px;
  --f2e-gutter-md: 48px;
  --f2e-gutter-sm: 20px;
}

/* ── Base Reset ── */
.f2e-root, .f2e-root * { box-sizing: border-box; }
.f2e-root img { max-width: 100%; height: auto; display: block; }
.f2e-root a { color: inherit; text-decoration: none; }
.f2e-root section { width: 100%; }

`;
    const classRules = Object.entries(rules).map(([sel, props]) => {
      const body = Object.entries(props).map(([k, v]) => `  ${k}: ${v};`).join("\n");
      return body ? `${sel} {\n${body}\n}` : null;
    }).filter(Boolean).join("\n\n");

    const responsive = `

/* ════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
════════════════════════════════════════ */

/* ── Tablet ≤ 1200px ── */
@media (max-width: 1200px) {
  .f2e-root [class*="f2e-"] { max-width: 100%; }
  [class*="section"], [class*="hero"], [class*="features"], [class*="proof"] {
    padding-left: var(--f2e-gutter-md) !important;
    padding-right: var(--f2e-gutter-md) !important;
  }
  [class*="grid"], [class*="feat-grid"] { flex-wrap: wrap; }
  [class*="feat-grid"] > * { width: calc(50% - 9px) !important; }
}

/* ── Mobile ≤ 768px ── */
@media (max-width: 768px) {
  [class*="section"], [class*="hero"], [class*="features"], [class*="proof"] {
    padding-left: var(--f2e-gutter-sm) !important;
    padding-right: var(--f2e-gutter-sm) !important;
    padding-top: 64px !important;
    padding-bottom: 64px !important;
  }
  [class*="hero-h1"] { font-size: clamp(28px, 9vw, 56px) !important; line-height: 1.1 !important; }
  [class*="hero-sub"] { font-size: 15px !important; }
  [class*="hero-ctas"], [class*="ctas"], [class*="proof-cta"] {
    flex-direction: column !important; width: 100% !important;
  }
  [class*="hero-ctas"] > *, [class*="cta-p"], [class*="cta-s"] {
    width: 100% !important; justify-content: center !important;
  }
  [class*="hero-metrics"], [class*="metrics"] { gap: 24px !important; flex-wrap: wrap !important; }
  [class*="feat-grid"] { flex-direction: column !important; }
  [class*="feat-grid"] > * { width: 100% !important; }
}

/* ── Small Mobile ≤ 480px ── */
@media (max-width: 480px) {
  [class*="hero-h1"] { font-size: clamp(24px, 10vw, 40px) !important; }
  [class*="hero-metrics"] { justify-content: space-around !important; }
}`;
    return varBlock + classRules + responsive;
  },

  walkCSS(node, rules, parentHasNoLayout = false) {
    const sel = `.${this.slugify(node.name)}`;
    const props = this.nodeToCSS(node);

    // Absolute positioning for children of non-layout containers
    if (parentHasNoLayout && node.depth > 0 && node.rx !== undefined) {
      props.position = "absolute";
      props.left = `${node.rx}px`;
      props.top = `${node.ry}px`;
      if (node.w > 0) props.width = `${node.w}px`;
      if (node.h > 0) props.height = `${node.h}px`;
    }

    if (Object.keys(props).length) rules[sel] = props;

    const thisNoLayout = !node.layout && (node.children?.length > 0);
    (node.children || []).forEach(c => this.walkCSS(c, rules, thisNoLayout));
  },

  nodeToHTML(node, indent = 0, parentHasNoLayout = false) {
    const pad = "  ".repeat(indent);
    const cls = this.slugify(node.name);
    const role = node.role;
    let tag = "div", extra = "";

    if (role === "hero" || role === "section") tag = "section";
    else if (role === "header") tag = "header";
    else if (role === "footer") tag = "footer";
    else if (role === "heading") {
      const fs = node.typo?.fontSize || 16;
      tag = fs >= 64 ? "h1" : fs >= 40 ? "h2" : fs >= 28 ? "h3" : fs >= 20 ? "h4" : "h5";
    } else if (role === "text" || role === "badge" || role === "stat") tag = "p";
    else if (role === "button") { tag = "a"; extra = ` href="#" role="button"`; }
    else if (role === "image") { tag = "figure"; }
    else if (role === "divider") { return `${pad}<hr class="${cls}">`; }

    const children = node.children || [];
    let inner = "";

    if (node.content) {
      const escaped = node.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>\n" + pad + "  ");
      inner = escaped;
    } else if (role === "image" && !children.length) {
      inner = `\n${pad}  <img src="placeholder.jpg" alt="${node.name || "image"}" loading="lazy">\n${pad}`;
    } else if (children.length) {
      const thisNoLayout = !node.layout && children.length > 0;
      inner = "\n" + children.map(c => this.nodeToHTML(c, indent + 1, thisNoLayout)).join("\n") + "\n" + pad;
    }

    return `${pad}<${tag} class="${cls}"${extra}>${inner}</${tag}>`;
  },

  generate(frames, tokens) {
    const rules = {};
    const htmlParts = frames.map(f => {
      this.walkCSS(f, rules, false);
      return this.nodeToHTML(f, 2, false);
    });

    const googleFonts = [...new Set(tokens.fonts.filter(f => !["system-ui", "Arial", "Helvetica", "Georgia", "Times New Roman"].includes(f)).map(f => f.replace(/ /g, "+")))]
      .map(f => `family=${f}:wght@300;400;500;600;700;800`).join("&");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Export — fig2el v3</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${googleFonts ? `<link href="https://fonts.googleapis.com/css2?${googleFonts}&display=swap" rel="stylesheet">` : ""}
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="f2e-root">
${htmlParts.join("\n")}
  </div>
</body>
</html>`;
    const css = this.cssToStr(rules, tokens);
    const previewHtml = frames.map(f => this.nodeToHTML(f, 0, false)).join("\n");
    return { html, css, previewHtml };
  }
};

/* ════════════════════════════════════════════════════════════════
   ③ ELEMENTOR MAPPER V3
════════════════════════════════════════════════════════════════ */
const Elementor = {
  _c: 0,
  uid() { return `e${(++this._c).toString(36)}${Math.random().toString(36).slice(2, 5)}`; },

  elType(node) {
    if (["hero", "section", "header", "footer"].includes(node.role)) return "section";
    if (node.layout || ["card", "grid", "container", "stat", "badge"].includes(node.role)) return "container";
    if (node.role === "button") return "button";
    if (node.role === "heading") return "heading";
    if (node.role === "image") return "image";
    if (node.role === "divider") return "divider";
    if (node.figmaType === "TEXT" || ["text"].includes(node.role)) return "text-editor";
    return "container";
  },

  buildSettings(node, type) {
    const s = {};
    const bg = node.background;
    if (bg) {
      if (bg.startsWith("linear-gradient") || bg.startsWith("radial-gradient")) {
        s.background_background = "gradient"; s.background_gradient_css = bg;
      } else { s.background_background = "classic"; s.background_color = bg; }
    }
    if (node.layout) {
      const l = node.layout;
      s.flex_direction = l.flexDirection; s.align_items = l.alignItems;
      s.justify_content = l.justifyContent;
      s.gap = { size: parseInt(l.gap) || 0, unit: "px" };
      s.padding = { top: l.pt, right: l.pr, bottom: l.pb, left: l.pl, unit: "px", isLinked: false };
    }
    if (node.borderRadius) s.border_radius = { size: parseInt(node.borderRadius) || 0, unit: "px" };
    if (node.border) { s.border_border = "solid"; s.border_color = node.border.split(" ").pop(); }
    if (node.effects?.boxShadow) { s.box_shadow_box_shadow_type = "yes"; s.box_shadow = node.effects.boxShadow; }
    if (node.opacity < 1) s.opacity = { size: node.opacity };
    if (node.typo) {
      const t = node.typo;
      s.title_color = t.isGradientText ? "#ffffff" : t.color;
      s.text_color = t.isGradientText ? "#ffffff" : t.color;
      s.typography_typography = "custom";
      s.typography_font_family = t.fontFamily;
      s.typography_font_size = { size: t.fontSize, unit: "px" };
      s.typography_font_weight = String(t.fontWeight);
      s.typography_line_height = { size: parseFloat(t.lineHeight) || 1.5, unit: "em" };
      s.text_align = t.textAlign;
      if (t.fontStyle === "italic") s.typography_font_style = "italic";
    }
    if (node.content) {
      if (type === "heading") s.title = node.content;
      else if (type === "button") s.text = node.content;
      else s.editor = `<p>${node.content.replace(/\n/g, "</p><p>")}</p>`;
    }
    if (type === "image") s.image = { url: "", id: "", alt: node.name };
    return s;
  },

  mapNode(node) {
    const type = this.elType(node);
    const el = {
      id: this.uid(), elType: type, isInner: node.depth > 0,
      settings: this.buildSettings(node, type),
      widgetType: ["section", "container"].includes(type) ? undefined : type,
      elements: (node.children || []).map(c => this.mapNode(c)),
      _figma: { id: node.id, name: node.name },
    };
    return el;
  },

  export(frames) {
    this._c = 0;
    return { version: "3.23.0", type: "page", title: "fig2el v3 Export", content: frames.map(f => this.mapNode(f)), settings: {}, __globals__: {} };
  }
};

/* ════════════════════════════════════════════════════════════════
   FIDELITY ANALYZER
════════════════════════════════════════════════════════════════ */
const analyzeFidelity = (frames) => {
  let pts = 0, total = 0;
  const issues = [];
  const walk = (n, depth) => {
    total += 10;
    if (n.background) pts += 2;
    if (n.layout) pts += 3;
    if (n.borderRadius) pts += 1;
    if (n.effects?.boxShadow) pts += 1;
    if (n.typo) pts += 2;
    if (n.border) pts += 1;
    // Issues
    if (!n.layout && n.children?.length > 0) {
      issues.push({ id: n.id, name: n.name, type: "abs", msg: "Positionnement absolu (pas d'Auto Layout)" });
    }
    (n.fills || []).forEach(f => {
      if (f.type === "IMAGE") issues.push({ id: n.id, name: n.name, type: "img", msg: "Image fill — nécessite l'API Figma réelle" });
    });
    if (n.typo?.isGradientText) issues.push({ id: n.id, name: n.name, type: "warn", msg: "Gradient text — rendu approximé via CSS clip" });
    (n.children || []).forEach(c => walk(c, depth + 1));
  };
  frames.forEach(f => walk(f, 0));
  const score = total > 0 ? Math.round((pts / total) * 100) : 0;
  return { score, issues: issues.slice(0, 12) };
};

/* ════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTER
════════════════════════════════════════════════════════════════ */
const HL = {
  html: c => c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g,'$1<span class="sy-t">$2</span>').replace(/([a-zA-Z-]+)=&quot;([^&]*)&quot;/g,'<span class="sy-a">$1</span>=<span class="sy-s">"$2"</span>').replace(/&quot;/g,'"').replace(/&gt;/g,'<span class="sy-t">&gt;</span>'),
  css:  c => c.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="sy-c">$1</span>').replace(/(--[\w-]+)(\s*:)/g,'<span class="sy-p">$1</span>$2').replace(/(:root|@media[^{]*|@keyframes[^{]*)/g,'<span class="sy-sel">$1</span>').replace(/([.#][a-zA-Z][\w-]*)/g,'<span class="sy-cl">$1</span>').replace(/([\w-]+)(\s*:)(?![^{]*\{)/g,'<span class="sy-p">$1</span>$2').replace(/:\s*([^;\n{}\\/][^;\n{}]*?)(\s*;)/g,(m,v,e)=>`: <span class="sy-v">${v}</span>${e}`),
  json: c => c.replace(/"([^"]+)":/g,'<span class="sy-p">"$1"</span>:').replace(/:\s*"([^"]*)"/g,': <span class="sy-s">"$1"</span>').replace(/:\s*(-?\d+\.?\d*)/g,': <span class="sy-n">$1</span>').replace(/:\s*(true|false|null)/g,': <span class="sy-k">$1</span>'),
};

/* ════════════════════════════════════════════════════════════════
   NODE ROLE TAG
════════════════════════════════════════════════════════════════ */
const RoleTag = ({ node }) => {
  if (node.role === "button") return <span className="tag t-btn">BTN</span>;
  if (node.role === "image") return <span className="tag t-img">IMG</span>;
  if (node.role === "heading") return <span className="tag t-head">H</span>;
  if (node.figmaType === "TEXT") return <span className="tag t-text">TXT</span>;
  if (node.role === "text") return <span className="tag t-text">TXT</span>;
  if (node.figmaType === "VECTOR") return <span className="tag t-group">VEC</span>;
  return <span className="tag t-frame">FRM</span>;
};

/* ════════════════════════════════════════════════════════════════
   LAYER TREE NODE  (tri-state checkboxes)
════════════════════════════════════════════════════════════════ */
const LayerNode = ({ node, depth, sel, onToggle, activeId, onActivate }) => {
  const [open, setOpen] = useState(depth < 2);
  const hasKids = node.children?.length > 0;

  const selfOn = sel.has(node.id);
  const anyKidOn = hasKids && node.children.some(c => sel.has(c.id) || c.children?.some(cc => sel.has(cc.id)));
  const state = selfOn ? "on" : anyKidOn ? "ind" : "off";

  const toggleSubtree = (n, val) => {
    onToggle(n.id, val);
    (n.children || []).forEach(c => toggleSubtree(c, val));
  };

  return (
    <div>
      <div className={`nrow ${activeId === node.id ? "active" : ""}`} style={{ paddingLeft: 6 + depth * 16 }} onClick={() => onActivate(node)}>
        <div className={`chk ${state}`} onClick={e => { e.stopPropagation(); toggleSubtree(node, state !== "on"); }}>
          {state === "on" && <I n="check" s={9} c="#000" />}
          {state === "ind" && <I n="minus" s={9} c="var(--go)" />}
        </div>
        <span style={{ color: "var(--fg3)", fontSize: 10, width: 11, textAlign: "center", flexShrink: 0, cursor: "pointer" }}
          onClick={e => { e.stopPropagation(); if (hasKids) setOpen(!open); }}>
          {hasKids ? (open ? "▾" : "▸") : "·"}
        </span>
        <RoleTag node={node} />
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11.5, color: "var(--fg1)" }}>{node.name}</span>
        {node.hasLayout ? <span className="tag t-flex">flex</span> : node.children?.length > 0 ? <span className="tag t-abs">abs</span> : null}
      </div>
      {open && hasKids && node.children.map(c => (
        <LayerNode key={c.id} node={c} depth={depth + 1} sel={sel} onToggle={onToggle} activeId={activeId} onActivate={onActivate} />
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   NODE INSPECTOR PANEL
════════════════════════════════════════════════════════════════ */
const NodeInspector = ({ node }) => {
  if (!node) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, color: "var(--fg3)" }}>
      <I n="layers" s={28} c="var(--rim2)" /><p style={{ fontSize: 12 }}>Sélectionnez un calque</p>
    </div>
  );

  const Row = ({ k, v, mono }) => (
    <div style={{ background: "var(--ink3)", borderRadius: 7, padding: "8px 11px", border: "1px solid var(--rim1)" }}>
      <div style={{ fontSize: 9, color: "var(--fg3)", fontWeight: 700, letterSpacing: ".06em", marginBottom: 3 }}>{k}</div>
      <div style={{ fontSize: 11.5, fontFamily: mono ? "var(--fmono)" : "var(--fui)", color: "var(--fg0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {String(v)}
        {typeof v === "string" && (v.startsWith("#") || v.startsWith("rgb")) &&
          <span style={{ width: 11, height: 11, background: v, display: "inline-block", borderRadius: 3, marginLeft: 5, border: "1px solid var(--rim1)", verticalAlign: "middle" }} />}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 12, overflow: "auto", height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: "1px solid var(--rim1)" }}>
        <RoleTag node={node} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</div>
          <div style={{ fontSize: 10, color: "var(--fg3)", fontFamily: "var(--fmono)" }}>{node.id} · d{node.depth}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <Row k="TYPE" v={node.figmaType} mono />
        <Row k="RÔLE" v={node.role} />
        <Row k="LARGEUR" v={`${node.w}px`} mono />
        <Row k="HAUTEUR" v={`${node.h}px`} mono />
        <Row k="POS X (abs)" v={`${node.ax}px`} mono />
        <Row k="POS Y (abs)" v={`${node.ay}px`} mono />
        <Row k="MODE" v={node.hasLayout ? "Flex Layout" : node.children?.length ? "Abs. Pos." : "Leaf"} />
        <Row k="OPACITÉ" v={node.opacity} mono />
      </div>
      {node.background && (
        <div style={{ background: "var(--ink3)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--rim1)" }}>
          <div style={{ fontSize: 9, color: "var(--fg3)", fontWeight: 700, letterSpacing: ".06em", marginBottom: 8 }}>BACKGROUND</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 7, background: node.background, border: "1px solid var(--rim2)", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontFamily: "var(--fmono)", color: "var(--fg2)", wordBreak: "break-all", lineHeight: 1.5 }}>{node.background}</span>
          </div>
        </div>
      )}
      {node.layout && (
        <div style={{ background: "var(--ink3)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--rim1)" }}>
          <div style={{ fontSize: 9, color: "var(--go)", fontWeight: 700, letterSpacing: ".06em", marginBottom: 8 }}>AUTO LAYOUT → FLEXBOX</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            {[["direction", node.layout.flexDirection], ["align", node.layout.alignItems], ["justify", node.layout.justifyContent], ["gap", node.layout.gap], ["padding-T", `${node.layout.pt}px`], ["padding-L", `${node.layout.pl}px`]].map(([k, v]) => (
              <div key={k} style={{ padding: "5px 8px", background: "var(--ink2)", borderRadius: 5, border: "1px solid var(--rim1)" }}>
                <div style={{ fontSize: 8, color: "var(--fg3)", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 10, color: "var(--go)", fontFamily: "var(--fmono)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {node.typo && (
        <div style={{ background: "var(--ink3)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--rim1)" }}>
          <div style={{ fontSize: 9, color: "var(--vi2)", fontWeight: 700, letterSpacing: ".06em", marginBottom: 8 }}>TYPOGRAPHIE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            {[["famille", node.typo.fontFamily], ["taille", `${node.typo.fontSize}px`], ["poids", String(node.typo.fontWeight)], ["align", node.typo.textAlign], ["line-h", node.typo.lineHeight], ["couleur", node.typo.isGradientText ? "gradient" : node.typo.color]].map(([k, v]) => (
              <div key={k} style={{ padding: "5px 8px", background: "var(--ink2)", borderRadius: 5, border: "1px solid var(--rim1)" }}>
                <div style={{ fontSize: 8, color: "var(--fg3)", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 10, color: "var(--vi2)", fontFamily: "var(--fmono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v}
                  {k === "couleur" && !node.typo.isGradientText && <span style={{ width: 9, height: 9, background: v, display: "inline-block", borderRadius: 2, marginLeft: 4, verticalAlign: "middle", border: "1px solid var(--rim1)" }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {node.effects?.boxShadow && (
        <div style={{ fontSize: 9, color: "var(--fg3)", padding: "8px 11px", background: "var(--ink3)", borderRadius: 8, border: "1px solid var(--rim1)", fontFamily: "var(--fmono)", lineHeight: 1.6, wordBreak: "break-all" }}>
          <div style={{ fontWeight: 700, letterSpacing: ".06em", marginBottom: 4 }}>BOX-SHADOW</div>
          <div style={{ color: "var(--fg1)", fontSize: 10 }}>{node.effects.boxShadow}</div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   LIVE PREVIEW
════════════════════════════════════════════════════════════════ */
const LivePreview = ({ html, css }) => {
  const [device, setDevice] = useState("desktop");
  const devW = { desktop: "100%", tablet: "768px", mobile: "390px" };
  const googleFonts = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600;700&display=swap";
  const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="${googleFonts}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#040609}${css || ""}</style></head><body><div class="f2e-root">${html || "<p style='padding:60px 40px;color:#44526e;font:500 14px Inter,sans-serif'>Sélectionnez des calques et cliquez Générer…</p>"}</div></body></html>`;

  return (
    <div className="prev-shell">
      <div className="prev-bar">
        <I n="eye" s={13} c="var(--fg3)" />
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--fg3)", letterSpacing: ".07em", marginRight: 8 }}>PREVIEW LIVE</span>
        {[["desktop", "desktop", "Desktop"], ["tablet", "tablet", "768px"], ["mobile", "mobile", "390px"]].map(([id, ico, lbl]) => (
          <button key={id} className={`dev-btn ${device === id ? "on" : ""}`} onClick={() => setDevice(id)}>
            <I n={ico} s={11} />{lbl}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--fg3)", fontFamily: "var(--fmono)" }}>
          {devW[device]}
        </span>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 14, background: "#050812", display: "flex", justifyContent: "center" }}>
        <iframe
          srcDoc={doc}
          style={{ width: devW[device], minHeight: "100%", border: "none", borderRadius: 10, transition: "width .35s cubic-bezier(.4,0,.2,1)" }}
          title="Live Preview"
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   CODE VIEWER
════════════════════════════════════════════════════════════════ */
const CodeViewer = ({ html, css, json }) => {
  const [tab, setTab] = useState("html");
  const [copied, setCopied] = useState(false);
  const tabs = [
    { id: "html", label: "HTML", lines: html?.split("\n").length || 0 },
    { id: "css", label: "CSS", lines: css?.split("\n").length || 0 },
    { id: "json", label: "Elementor JSON", lines: json ? JSON.stringify(json, null, 2).split("\n").length : 0 },
  ];
  const src = tab === "html" ? html : tab === "css" ? css : JSON.stringify(json, null, 2);
  const highlighted = tab === "html" ? HL.html(src?.slice(0, 16000) || "") : tab === "css" ? HL.css(src?.slice(0, 16000) || "") : HL.json(src?.slice(0, 16000) || "");
  const copy = () => { navigator.clipboard.writeText(src || ""); setCopied(true); setTimeout(() => setCopied(false), 2e3); };

  return (
    <div className="panel" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--rim1)", padding: "0 8px", flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 13px", fontSize: 12, fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", background: "transparent", border: "none", fontFamily: "var(--fui)", color: tab === t.id ? "var(--go)" : "var(--fg3)", borderBottom: `2px solid ${tab === t.id ? "var(--go)" : "transparent"}`, transition: "all .15s" }}>
            {t.label}&nbsp;<span style={{ fontSize: 10, background: "var(--ink3)", padding: "1px 5px", borderRadius: 4, color: "var(--fg3)" }}>{t.lines}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost" style={{ fontSize: 11, gap: 5, color: copied ? "var(--go)" : "var(--fg3)" }} onClick={copy}>
          {copied ? <><I n="check" s={12} c="var(--go)" />Copié</> : <><I n="copy" s={12} />Copier</>}
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", background: "#040610", display: "flex", minHeight: 0 }}>
        <div style={{ padding: "16px 10px 16px 14px", textAlign: "right", color: "var(--fg3)", fontSize: 10.5, fontFamily: "var(--fmono)", lineHeight: 1.72, userSelect: "none", borderRight: "1px solid var(--rim1)", minWidth: 40, flexShrink: 0 }}>
          {(src || "").split("\n").slice(0, 400).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre style={{ flex: 1, padding: "16px 20px", margin: 0, fontFamily: "var(--fmono)", fontSize: 11.5, lineHeight: 1.72, color: "#c5d0e6", overflow: "visible", whiteSpace: "pre" }}
          dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STEPPER NAV
════════════════════════════════════════════════════════════════ */
const STEPS = [
  { id: "import", label: "Import", icon: "upload" },
  { id: "select", label: "Sélection", icon: "layers" },
  { id: "generate", label: "Générer", icon: "code" },
  { id: "export", label: "Export", icon: "export2" },
];

const StepNav = ({ current }) => {
  const ci = STEPS.findIndex(s => s.id === current);
  return (
    <div className="stepnav">
      {STEPS.map((s, i) => {
        const done = i < ci, active = i === ci;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(34,216,122,.1)" : active ? "rgba(0,232,179,.1)" : "var(--ink4)", border: `1px solid ${done ? "rgba(34,216,122,.25)" : active ? "rgba(0,232,179,.3)" : "var(--rim1)"}`, transition: "all .3s" }}>
                {done ? <I n="check" s={12} c="var(--em)" /> : <I n={s.icon} s={12} c={active ? "var(--go)" : "var(--fg3)"} />}
              </div>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: done ? "var(--em)" : active ? "var(--fg0)" : "var(--fg3)", transition: "all .3s" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < ci ? "rgba(34,216,122,.25)" : "var(--rim1)", margin: "0 8px", transition: "background .4s" }} />}
          </div>
        );
      })}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   LOADER
════════════════════════════════════════════════════════════════ */
const Loader = ({ label, prog }) => (
  <div className="loader-wrap">
    <div className="spinner" />
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--fhd)", fontSize: 16, fontWeight: 700, color: "var(--fg0)", marginBottom: 10 }}>{label}</p>
      {prog != null && <div className="prog-wrap"><div className="prog-bar" style={{ width: `${prog}%` }} /></div>}
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════════════ */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast"><I n="check" s={14} c="var(--em)" /><span style={{ color: "var(--fg0)" }}>{msg}</span></div>;
};

/* ════════════════════════════════════════════════════════════════
   STEP 1 — IMPORT
════════════════════════════════════════════════════════════════ */
const StepImport = ({ onImport }) => {
  const [tab, setTab] = useState("demo");
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [json, setJson] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const go = d => { setLoading(false); onImport(d); };
  const tryJSON = () => { try { go(JSON.parse(json)); } catch { setErr("JSON invalide."); } };

  return (
    <div className="u-fadeup" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(0,232,179,.06)", border: "1px solid rgba(0,232,179,.16)", borderRadius: 99, marginBottom: 20, fontSize: 11, color: "var(--go)", fontWeight: 700, letterSpacing: ".04em" }}>
          <I n="wand" s={11} c="var(--go)" /> V3 — FIDÉLITÉ MAXIMALE + SÉLECTION DES CALQUES
        </div>
        <h1 style={{ fontFamily: "var(--fhd)", fontSize: 38, fontWeight: 800, lineHeight: 1.1, marginBottom: 14 }}>
          Importez votre<br />
          <span style={{ backgroundImage: "linear-gradient(120deg,var(--go),var(--vi2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>design Figma</span>
        </h1>
        <p style={{ color: "var(--fg2)", fontSize: 14, lineHeight: 1.65, maxWidth: 420, margin: "0 auto" }}>
          URL Figma via token API, upload JSON ou design de démonstration — le pipeline de conversion démarre instantanément.
        </p>
      </div>

      <div className="tabbar" style={{ marginBottom: 18 }}>
        {[["demo", "⚡ Démo"], ["url", "🔗 API Figma"], ["json", "{ } JSON"]].map(([id, lbl]) => (
          <button key={id} className={`tabbtn ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
        ))}
      </div>

      <div className="panel" style={{ padding: 28 }}>
        {tab === "demo" && (
          <div className="u-fadein" style={{ textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(135deg,rgba(0,232,179,.1),rgba(123,111,240,.1))", border: "1px solid var(--rim2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 30 }}>✦</div>
            <h3 style={{ fontFamily: "var(--fhd)", fontSize: 19, fontWeight: 700, marginBottom: 8 }}>Landing Page de démonstration</h3>
            <p style={{ color: "var(--fg2)", fontSize: 13, lineHeight: 1.6, marginBottom: 22, maxWidth: 360, margin: "0 auto 22px" }}>
              Hero + Features + CTA · Auto Layout · Gradients · Effets · 20+ nœuds — conçu pour tester toutes les fonctionnalités du parser v3.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
              {[["3", "Sections"], ["20+", "Nœuds"], ["6", "Gradients"], ["4", "Polices"]].map(([n, l]) => (
                <div key={l} style={{ padding: "10px 0", background: "var(--ink3)", borderRadius: 8, border: "1px solid var(--rim1)" }}>
                  <div style={{ fontFamily: "var(--fhd)", fontSize: 18, fontWeight: 800, color: "var(--go)" }}>{n}</div>
                  <div style={{ fontSize: 10, color: "var(--fg3)", marginTop: 1 }}>{l}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-prime" style={{ width: "100%", height: 44, justifyContent: "center" }} onClick={() => go(DEMO_FIGMA)}>
              <I n="zap" s={14} /> Charger la démo
            </button>
          </div>
        )}
        {tab === "url" && (
          <div className="u-fadein" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--fg3)", letterSpacing: ".06em" }}>TOKEN FIGMA PERSONNEL</label>
              <input value={token} onChange={e => { setToken(e.target.value); setErr(""); }} placeholder="figd_xxxxxxxxxxxxxxxxxxxx" type="password" />
              <span style={{ fontSize: 11, color: "var(--fg3)", lineHeight: 1.5 }}>
                Figma → Account Settings → Personal access tokens → Generate new token
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--fg3)", letterSpacing: ".06em" }}>URL FIGMA</label>
              <input value={url} onChange={e => { setUrl(e.target.value); setErr(""); }} placeholder="https://www.figma.com/file/XXXXX/Mon-Design" />
            </div>
            <div style={{ padding: 12, background: "rgba(0,232,179,.04)", border: "1px solid rgba(0,232,179,.14)", borderRadius: 9, fontSize: 12, color: "var(--go)", lineHeight: 1.6 }}>
              ✓ Sur Vercel, le proxy <code style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "0 4px", background: "rgba(0,0,0,.3)", borderRadius: 3 }}>/api/figma/file</code> est déjà actif.
              Vous pouvez aussi configurer <code style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "0 4px", background: "rgba(0,0,0,.3)", borderRadius: 3 }}>FIGMA_TOKEN</code> dans les variables d'environnement Vercel pour ne plus avoir à saisir le token ici.
            </div>
            {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7, border: "1px solid rgba(255,92,106,.16)" }}>{err}</div>}
            <button className="btn btn-prime" style={{ width: "100%", height: 44, justifyContent: "center" }} disabled={!url || !token || loading} onClick={async () => {
              // Extract fileKey from Figma URL
              const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
              if (!match) { setErr("URL Figma invalide. Format : https://www.figma.com/file/XXXXX/..."); return; }
              const fileKey = match[1];
              setLoading(true); setErr("");
              try {
                const res = await fetch(`/api/figma/file?fileKey=${fileKey}&token=${encodeURIComponent(token)}`);
                const data = await res.json();
                if (!res.ok) { setErr(data.error || `Erreur ${res.status}`); setLoading(false); return; }
                go(data);
              } catch (e) { setErr("Erreur réseau : " + e.message); setLoading(false); }
            }}>
              {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Import en cours…</> : <><I n="link" s={14} /> Importer depuis Figma</>}
            </button>
          </div>
        )}
        {tab === "json" && (
          <div className="u-fadein" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input type="file" accept=".json" ref={fileRef} style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { go(JSON.parse(ev.target.result)); } catch { setErr("Fichier illisible."); } }; r.readAsText(f); }} />
            <button className="btn btn-solid" style={{ width: "100%", height: 48, justifyContent: "center", borderStyle: "dashed" }} onClick={() => fileRef.current.click()}>
              <I n="upload" s={14} /> Uploader un .json Figma
            </button>
            <div style={{ textAlign: "center", color: "var(--fg3)", fontSize: 11 }}>— ou collez directement —</div>
            <textarea value={json} onChange={e => { setJson(e.target.value); setErr(""); }} placeholder='{"document":{"id":"0:0","type":"DOCUMENT","children":[...]}}' rows={7} style={{ fontFamily: "var(--fmono)", fontSize: 11, resize: "vertical" }} />
            {err && <div style={{ color: "var(--re)", fontSize: 12, padding: "8px 12px", background: "rgba(255,92,106,.06)", borderRadius: 7, border: "1px solid rgba(255,92,106,.16)" }}>{err}</div>}
            <button className="btn btn-prime" style={{ width: "100%", height: 44, justifyContent: "center" }} onClick={tryJSON}>
              <I n="cpu" s={14} /> Parser le JSON
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center", marginTop: 22 }}>
        {["Flex + Absolu", "Gradients", "Effets/Ombres", "Design Tokens", "Preview live", "JSON Elementor"].map(f => (
          <span key={f} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fg3)" }}>
            <I n="check" s={11} c="var(--go)" />{f}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STEP 2 — LAYER SELECTION
════════════════════════════════════════════════════════════════ */
const StepSelect = ({ parsed, onContinue }) => {
  const allIds = useMemo(() => { const s = new Set(); const w = n => { s.add(n.id); (n.children || []).forEach(w); }; parsed.frames.forEach(w); return s; }, [parsed]);
  const [sel, setSel] = useState(() => new Set(allIds));
  const [active, setActive] = useState(parsed.frames[0]);
  const [search, setSearch] = useState("");

  const toggle = (id, val) => setSel(prev => { const n = new Set(prev); val ? n.add(id) : n.delete(id); return n; });

  const filterNode = n => { if (!sel.has(n.id)) return null; const k = (n.children || []).map(filterNode).filter(Boolean); return { ...n, children: k }; };

  const { score, issues } = useMemo(() => analyzeFidelity(parsed.frames), [parsed]);
  const selCount = [...allIds].filter(id => sel.has(id)).length;
  const totalCount = allIds.size;

  const fidColor = score >= 80 ? "var(--em)" : score >= 60 ? "var(--am)" : "var(--re)";

  return (
    <div className="u-fadeup" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--fhd)", fontSize: 22, fontWeight: 800, marginBottom: 3 }}>Sélection des calques</h2>
          <p style={{ fontSize: 12, color: "var(--fg3)" }}>
            <span style={{ color: "var(--go)", fontWeight: 700 }}>{selCount}</span>/{totalCount} nœuds sélectionnés
            · {parsed.frames.length} frame(s) · {parsed.tokens.fonts.length} police(s)
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => setSel(new Set(allIds))}>Tout sélect.</button>
          <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => setSel(new Set())}>Tout désélect.</button>
          <button className="btn btn-prime" disabled={selCount === 0} onClick={() => { const f = parsed.frames.map(filterNode).filter(Boolean); onContinue({ ...parsed, frames: f, selCount }); }}>
            Générer ({selCount}) <I n="arrow" s={13} />
          </button>
        </div>
      </div>

      {/* Fidelity bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--ink3)", border: "1px solid var(--rim1)", borderRadius: 10 }}>
        <I n="target" s={14} c={fidColor} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--fg1)" }}>Score de fidélité estimé</span>
            <span style={{ fontFamily: "var(--fmono)", fontSize: 13, fontWeight: 700, color: fidColor }}>{score}%</span>
          </div>
          <div className="fidbar"><div className="fidfill" style={{ width: `${score}%`, background: score >= 80 ? "var(--em)" : score >= 60 ? "var(--am)" : "var(--re)" }} /></div>
        </div>
        {issues.length > 0 && (
          <div style={{ fontSize: 11, color: "var(--am)", display: "flex", alignItems: "center", gap: 4 }}>
            <I n="info" s={12} c="var(--am)" /> {issues.length} avertissement{issues.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Grid: Tree + Inspector */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "260px 1fr", gap: 12, minHeight: 0 }}>
        {/* Tree */}
        <div className="panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div className="phead">
            <I n="layers" s={13} c="var(--fg3)" />
            <span className="plabel" style={{ flex: 1 }}>CALQUES ({selCount}/{totalCount})</span>
          </div>
          <div style={{ padding: "8px 8px 6px", borderBottom: "1px solid var(--rim1)" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" style={{ fontSize: 11, padding: "6px 10px" }} />
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "4px 0" }}>
            {parsed.frames.map(f => (
              <LayerNode key={f.id} node={f} depth={0} sel={sel} onToggle={toggle} activeId={active?.id} onActivate={setActive} />
            ))}
          </div>
        </div>

        {/* Inspector + Tokens */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
          <div className="panel" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div className="phead">
              <I n="settings" s={13} c="var(--fg3)" />
              <span className="plabel">INSPECTEUR</span>
              {active && <span style={{ marginLeft: "auto", fontFamily: "var(--fmono)", fontSize: 10, color: "var(--fg3)" }}>{active.figmaType} · {active.w}×{active.h}</span>}
            </div>
            <div style={{ flex: 1, overflow: "auto" }}><NodeInspector node={active} /></div>
          </div>
          {/* Tokens + Issues */}
          <div className="panel" style={{ flexShrink: 0, padding: 14 }}>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: "var(--fg3)", fontWeight: 700, letterSpacing: ".07em", marginBottom: 10 }}>COULEURS ({parsed.tokens.colors.length})</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {parsed.tokens.colors.slice(0, 14).map((c, i) => (
                    <div key={i} title={c} style={{ width: 20, height: 20, background: c, borderRadius: 4, border: "1px solid var(--rim2)", cursor: "default" }} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: "var(--fg3)", fontWeight: 700, letterSpacing: ".07em", marginBottom: 10 }}>POLICES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {parsed.tokens.fonts.map((f, i) => (
                    <span key={i} style={{ fontSize: 10, padding: "3px 9px", background: "rgba(123,111,240,.1)", border: "1px solid rgba(123,111,240,.18)", borderRadius: 5, color: "var(--vi2)", fontFamily: "var(--fmono)" }}>{f}</span>
                  ))}
                </div>
              </div>
              {issues.length > 0 && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: "var(--am)", fontWeight: 700, letterSpacing: ".07em", marginBottom: 10 }}>AVERTISSEMENTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 80, overflow: "auto" }}>
                    {issues.slice(0, 4).map((iss, i) => (
                      <div key={i} style={{ fontSize: 10, color: "var(--fg2)", display: "flex", gap: 5, lineHeight: 1.4 }}>
                        <span style={{ color: "var(--am)", flexShrink: 0 }}>⚠</span>{iss.name}: {iss.msg}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STEP 3 — GENERATE + PREVIEW
════════════════════════════════════════════════════════════════ */
const StepGenerate = ({ code, parsed, onContinue }) => {
  const [layout, setLayout] = useState("split");
  const { score } = useMemo(() => analyzeFidelity(parsed.frames), [parsed]);
  const fidColor = score >= 80 ? "var(--em)" : score >= 60 ? "var(--am)" : "var(--re)";

  return (
    <div className="u-fadeup" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--fhd)", fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Code généré + Preview live</h2>
          <p style={{ fontSize: 12, color: "var(--fg3)" }}>
            {parsed.selCount || "?"} nœuds · {code.html.split("\n").length}L HTML · {code.css.split("\n").length}L CSS ·
            Fidélité&nbsp;<span style={{ color: fidColor, fontWeight: 700 }}>{score}%</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="tabbar" style={{ marginBottom: 0 }}>
            {[["split", "Split"], ["preview", "Preview"], ["code", "Code"]].map(([id, lbl]) => (
              <button key={id} className={`tabbtn ${layout === id ? "on" : ""}`} style={{ padding: "6px 14px" }} onClick={() => setLayout(id)}>{lbl}</button>
            ))}
          </div>
          <button className="btn btn-prime" onClick={onContinue}><I n="export2" s={13} /> Exporter</button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "grid", gap: 14, gridTemplateColumns: layout === "split" ? "1fr 1fr" : "1fr" }}>
        {(layout === "preview" || layout === "split") && (
          <LivePreview html={code.previewHtml} css={code.css} />
        )}
        {(layout === "code" || layout === "split") && (
          <CodeViewer html={code.html} css={code.css} json={code.json} />
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STEP 4 — EXPORT
════════════════════════════════════════════════════════════════ */
const SERVER_JS = `// ─── fig2el v3 Backend ─── Node.js + Express ───────────────
// npm install express cors node-fetch@2 dotenv
// PORT=3001 FIGMA_TOKEN=figd_xxx node server.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const app     = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

// ── Fetch full Figma file ──────────────────────────────────
app.get('/api/figma/file', async (req, res) => {
  const { fileKey, token } = req.query;
  if (!fileKey) return res.status(400).json({ error: 'fileKey requis' });
  const tok = token || process.env.FIGMA_TOKEN;
  try {
    const r = await fetch(
      \`https://api.figma.com/v1/files/\${fileKey}?geometry=paths\`,
      { headers: { 'X-FIGMA-TOKEN': tok } }
    );
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Fetch images (fills + exports) ────────────────────────
app.get('/api/figma/images', async (req, res) => {
  const { fileKey, ids, scale = 2, format = 'png', token } = req.query;
  const tok = token || process.env.FIGMA_TOKEN;
  try {
    const r = await fetch(
      \`https://api.figma.com/v1/images/\${fileKey}?ids=\${ids}&scale=\${scale}&format=\${format}\`,
      { headers: { 'X-FIGMA-TOKEN': tok } }
    );
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Fetch file nodes ───────────────────────────────────────
app.get('/api/figma/nodes', async (req, res) => {
  const { fileKey, ids, token } = req.query;
  const tok = token || process.env.FIGMA_TOKEN;
  try {
    const r = await fetch(
      \`https://api.figma.com/v1/files/\${fileKey}/nodes?ids=\${ids}\`,
      { headers: { 'X-FIGMA-TOKEN': tok } }
    );
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Health ─────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true, v: 3 }));

app.listen(process.env.PORT || 3001, () =>
  console.log('fig2el backend → http://localhost:' + (process.env.PORT || 3001))
);`;

const StepExport = ({ code, parsed }) => {
  const [toast, setToast] = useState(null);
  const dl = (content, name, type = "text/plain") => {
    const b = new Blob([content], { type }); const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: name }).click();
    URL.revokeObjectURL(u); setToast(`${name} téléchargé ✓`);
  };
  const dlAll = () => {
    dl(code.html, "index.html", "text/html");
    setTimeout(() => dl(code.css, "styles.css", "text/css"), 200);
    setTimeout(() => dl(JSON.stringify(code.json, null, 2), "elementor-template.json", "application/json"), 400);
    setTimeout(() => dl(SERVER_JS, "server.js", "text/javascript"), 600);
  };
  const { score, issues } = useMemo(() => analyzeFidelity(parsed.frames), [parsed]);
  const fidColor = score >= 80 ? "var(--em)" : score >= 60 ? "var(--am)" : "var(--re)";

  const cards = [
    { ico: "🌐", title: "HTML + CSS", sub: "Page déployable immédiatement", desc: "HTML5 sémantique avec positionnement Flex + Absolu, CSS responsive (3 breakpoints), design tokens CSS.", badge: "b-go", files: ["index.html", "styles.css"], fn: () => { dl(code.html, "index.html", "text/html"); dl(code.css, "styles.css", "text/css"); } },
    { ico: "🔧", title: "Elementor JSON", sub: "Import WordPress direct", desc: "Template JSON Elementor 3.23+. Import via Elementor → Templates → Importer un template.", badge: "b-vi", files: ["elementor-template.json"], fn: () => dl(JSON.stringify(code.json, null, 2), "elementor-template.json", "application/json") },
    { ico: "⚙️", title: "Backend Express", sub: "Proxy API Figma réelle", desc: "Serveur Node.js avec proxy CORS : /api/figma/file, /api/figma/images, /api/figma/nodes.", badge: "b-am", files: ["server.js"], fn: () => dl(SERVER_JS, "server.js", "text/javascript") },
    { ico: "📦", title: "Bundle complet", sub: "Tous les fichiers", desc: "HTML + CSS + JSON Elementor + server.js — tout en un clic.", badge: "b-em", files: ["index.html", "styles.css", "elementor.json", "server.js"], fn: dlAll, featured: true },
  ];

  return (
    <div className="u-fadeup" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ width: 58, height: 58, borderRadius: 16, background: "rgba(34,216,122,.1)", border: "1px solid rgba(34,216,122,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
        <h2 style={{ fontFamily: "var(--fhd)", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Conversion terminée !</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {[[`${parsed.frames.reduce((a, f) => { let n = 0; const w = x => { n++; (x.children || []).forEach(w); }; w(f); return a + n; }, 0)}`, "nœuds"], [`${parsed.tokens.colors.length}`, "couleurs"], [`${parsed.tokens.fonts.length}`, "polices"], [`${score}%`, "fidélité"]].map(([v, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--fg2)" }}>
              <span style={{ fontFamily: "var(--fhd)", fontSize: 15, fontWeight: 700, color: l === "fidélité" ? fidColor : "var(--go)" }}>{v}</span> {l}
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {cards.map((c, i) => (
          <div key={i} className={`xcard ${c.featured ? "featured" : ""}`} onClick={c.fn}>
            <div style={{ display: "flex", gap: 13 }}>
              <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{c.ico}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "var(--fhd)", fontSize: 15, fontWeight: 700 }}>{c.title}</span>
                  <span className={`badge ${c.badge}`} style={{ fontSize: 9 }}>{c.sub}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--fg2)", lineHeight: 1.5, marginBottom: 10 }}>{c.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {c.files.map(f => <span key={f} style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "2px 7px", background: "var(--ink2)", border: "1px solid var(--rim1)", borderRadius: 4, color: "var(--fg3)" }}>{f}</span>)}
                </div>
              </div>
              <I n="export2" s={15} c="var(--go)" />
            </div>
          </div>
        ))}
      </div>

      {/* Fidelity report */}
      {issues.length > 0 && (
        <div className="panel" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <I n="info" s={14} c="var(--am)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--am)", letterSpacing: ".05em" }}>RAPPORT DE FIDÉLITÉ ({issues.length} point{issues.length > 1 ? "s" : ""} d'attention)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {issues.map((iss, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--fg2)", padding: "7px 10px", background: "var(--ink3)", borderRadius: 7, border: "1px solid var(--rim1)" }}>
                <span style={{ flexShrink: 0 }}>{iss.type === "img" ? "🖼" : iss.type === "abs" ? "📐" : "⚠️"}</span>
                <span><strong style={{ color: "var(--fg0)" }}>{iss.name}</strong> — {iss.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WP guide */}
      <div className="panel" style={{ padding: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--fg3)", letterSpacing: ".07em", marginBottom: 14 }}>INTÉGRATION WORDPRESS + ELEMENTOR PRO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["01", "Backend local", "npm install && node server.js (port 3001) pour l'import API réelle."], ["02", "Importer le template", "Elementor → Templates → Importer → elementor-template.json"], ["03", "Insérer la page", "Éditeur Elementor → Bibliothèque → Mes Templates → Insérer"], ["04", "Polices + Images", "Installer les polices via Elementor Global Fonts. Remplacer les images placeholder."]].map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 11, padding: "12px 13px", background: "var(--ink3)", borderRadius: 9, border: "1px solid var(--rim1)" }}>
              <span style={{ fontFamily: "var(--fmono)", fontSize: 13, fontWeight: 800, color: "var(--go)", flexShrink: 0, minWidth: 22 }}>{n}</span>
              <div><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{t}</div><div style={{ fontSize: 11, color: "var(--fg3)", lineHeight: 1.5 }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════════ */
export default function Fig2elApp() {
  const [step, setStep] = useState("import");
  const [loader, setLoader] = useState(null);
  const [prog, setProg] = useState(0);
  const [parsed, setParsed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState(null);

  const run = (label, fn, ms = 1200) => {
    setProg(0); setLoader(label);
    const iv = setInterval(() => setProg(p => Math.min(p + 7, 88)), 120);
    setTimeout(() => { clearInterval(iv); setProg(100); setTimeout(() => { fn(); setLoader(null); }, 200); }, ms);
  };

  const onImport = useCallback(data => {
    run("Parsing Figma v3 — extraction complète…", () => {
      setParsed(Parser.parseDoc(data));
      setStep("select");
    }, 1300);
  }, []);

  const onSelect = useCallback(sel => {
    setSelected(sel);
    run("Génération HTML + CSS + JSON Elementor…", () => {
      const { html, css, previewHtml } = Generator.generate(sel.frames, sel.tokens);
      const json = Elementor.export(sel.frames);
      setCode({ html, css, previewHtml, json });
      setStep("generate");
    }, 1600);
  }, []);

  const reset = () => { setStep("import"); setParsed(null); setSelected(null); setCode(null); };

  return (
    <>
      <style>{CSS_GLOBAL}</style>
      {loader && <Loader label={loader} prog={prog} />}

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* ── TopBar */}
        <header style={{ height: 52, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid var(--rim1)", background: "var(--ink2)", flexShrink: 0, gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,var(--vi),var(--go))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I n="figma" s={14} c="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--fhd)", fontSize: 14, fontWeight: 800, lineHeight: 1 }}>fig<span style={{ color: "var(--go)" }}>2el</span></div>
              <div style={{ fontSize: 8, color: "var(--fg3)", letterSpacing: ".08em" }}>FIGMA → ELEMENTOR V3</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}><StepNav current={step} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {step !== "import" && <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={reset}>← Nouveau</button>}
            {parsed && <span style={{ fontFamily: "var(--fmono)", fontSize: 10, padding: "3px 9px", background: "var(--ink4)", border: "1px solid var(--rim1)", borderRadius: 6, color: "var(--fg3)" }}>{parsed.meta.frameCount}fr · {parsed.tokens.colors.length}c · {parsed.tokens.fonts.join(",")}</span>}
          </div>
        </header>

        {/* ── Main content */}
        <main style={{ flex: 1, overflow: "auto", padding: (step === "import" || step === "export") ? "40px 28px" : "18px 20px", background: "var(--ink0)" }}>
          {step === "import"   && <StepImport onImport={onImport} />}
          {step === "select"   && parsed  && <StepSelect parsed={parsed} onContinue={onSelect} />}
          {step === "generate" && code    && <StepGenerate code={code} parsed={selected || parsed} onContinue={() => setStep("export")} />}
          {step === "export"   && code    && <StepExport code={code} parsed={selected || parsed} />}
        </main>

        {/* ── StatusBar */}
        <div style={{ height: 24, display: "flex", alignItems: "center", padding: "0 16px", borderTop: "1px solid var(--rim1)", background: "var(--ink2)", gap: 14, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--em)", boxShadow: "0 0 5px var(--em)" }} />
            <span style={{ fontSize: 10, color: "var(--fg3)" }}>Prêt</span>
          </div>
          <div style={{ width: 1, height: 12, background: "var(--rim1)" }} />
          {code && <span style={{ fontSize: 10, color: "var(--fg3)" }}>{code.html.split("\n").length}L HTML · {code.css.split("\n").length}L CSS · {JSON.stringify(code.json).length > 1000 ? (JSON.stringify(code.json).length / 1000).toFixed(1) + "KB" : JSON.stringify(code.json).length + "B"} JSON</span>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 9, color: "var(--fg3)", fontFamily: "var(--fmono)" }}>Parser v3.0 · Flex+Abs · Elementor 3.23+ · fig2el</span>
        </div>
      </div>
    </>
  );
}
