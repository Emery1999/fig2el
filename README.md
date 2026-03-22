fig2el — Figma → Elementor Converter
> Convertissez vos designs Figma en HTML pixel-perfect, CSS responsive et JSON Elementor prêt pour WordPress.
---
🚀 Déploiement sur Vercel (5 minutes)
Prérequis
Compte GitHub (gratuit)
Compte Vercel (gratuit)
Token API Figma (optionnel pour la démo)
---
Étape 1 — Pousser le code sur GitHub
```bash
# 1. Créez un nouveau dépôt sur GitHub (github.com/new)
#    Nom suggéré : fig2el  |  Visibilité : Private

# 2. Dans ce dossier, initialisez git :
git init
git add .
git commit -m "feat: fig2el v3 initial"

# 3. Connectez votre dépôt GitHub :
git remote add origin https://github.com/VOTRE_USERNAME/fig2el.git
git branch -M main
git push -u origin main
```
---
Étape 2 — Importer sur Vercel
Allez sur vercel.com/new
Cliquez "Import Git Repository"
Sélectionnez votre dépôt `fig2el`
Vercel détecte automatiquement Next.js → cliquez Deploy
⏱ Le premier déploiement prend ~2 minutes.
---
Étape 3 — Configurer les variables d'environnement
Pour activer l'import direct depuis l'API Figma :
Dans votre projet Vercel → Settings → Environment Variables
Ajoutez :
Name	Value	Environment
`FIGMA_TOKEN`	`figd_xxxxxxxxxxxx`	Production + Preview
Cliquez Save puis Redeploy (Deployments → ⋯ → Redeploy)
> **Obtenir votre token Figma :**
> Figma → Account Settings → Personal access tokens → Generate new token
> Copiez le token (affiché une seule fois).
---
Résultat
Votre app est disponible sur : `https://fig2el-xxxx.vercel.app`
---
🛠 Développement local
```bash
# 1. Installez les dépendances
npm install

# 2. Créez votre fichier .env.local
cp .env.example .env.local
# Éditez .env.local et ajoutez votre FIGMA_TOKEN

# 3. Lancez le serveur de dev
npm run dev
# → http://localhost:3000
```
---
📁 Structure du projet
```
fig2el/
├── pages/
│   ├── index.js              # Page principale (Next.js)
│   ├── _app.js               # Wrapper global
│   └── api/
│       ├── figma/
│       │   ├── file.js       # GET /api/figma/file?fileKey=X&token=Y
│       │   ├── images.js     # GET /api/figma/images?fileKey=X&ids=...
│       │   └── nodes.js      # GET /api/figma/nodes?fileKey=X&ids=...
│       └── health.js         # GET /api/health
├── components/
│   └── Fig2elApp.jsx         # Application complète (~1700 lignes)
│       ├── Parser v3         # Figma JSON → Intermediate Format
│       ├── Generator v3      # Intermediate → HTML + CSS (Flex + Abs)
│       ├── Elementor mapper  # Intermediate → Elementor JSON
│       ├── StepImport        # Étape 1 : Import Figma
│       ├── StepSelect        # Étape 2 : Sélection des calques
│       ├── StepGenerate      # Étape 3 : Preview + Code
│       └── StepExport        # Étape 4 : Téléchargements
├── styles/
│   └── globals.css           # Reset CSS minimal
├── public/                   # Assets statiques
├── .env.example              # Template variables d'env
├── .gitignore
├── next.config.js
├── vercel.json
└── package.json
```
---
🔌 API Routes (Vercel Serverless Functions)
`GET /api/figma/file`
Récupère un fichier Figma complet.
Paramètre	Type	Requis	Description
`fileKey`	string	✅	ID du fichier Figma (dans l'URL)
`token`	string	⚠️	Token Figma (si `FIGMA_TOKEN` non configuré)
Exemple :
```
GET /api/figma/file?fileKey=abc123XYZ&token=figd_xxx
```
---
`GET /api/figma/images`
Récupère les URLs des assets image d'un fichier.
Paramètre	Type	Défaut	Description
`fileKey`	string	—	ID du fichier
`ids`	string	—	IDs des nœuds, séparés par virgules
`scale`	number	`2`	Résolution (1, 2, 3, 4)
`format`	string	`png`	`png`, `svg`, `jpg`, `pdf`
---
`GET /api/health`
Vérifie que le backend fonctionne.
```json
{ "ok": true, "version": "3.0.0", "figmaTokenConfigured": true }
```
---
⚙️ Pipeline de conversion
```
Figma JSON
    ↓
Parser v3           extractFills · parseLayout · parseEffects · parseTypo
    ↓
Intermediate Format {id, role, layout, typo, background, effects, dims, children}
    ↓  
Generator v3        Flex mode (layoutMode) + Absolute mode (no layoutMode)
    ↓
HTML5 + CSS         Design tokens · Responsive · 3 breakpoints
    ↓
Elementor Mapper    Section · Container · Heading · Text · Button · Image
    ↓
Elementor JSON      v3.23+ compatible · Import direct WordPress
```
---
🎯 Score de fidélité
Élément	Fidélité	Notes
Auto Layout → Flexbox	✅ ~95%	Direction, align, justify, gap, padding
Positionnement absolu	✅ ~90%	Pour les frames sans layoutMode
Couleurs & Gradients	✅ ~95%	Linear (angle réel), radial, conic
Typographie	✅ ~92%	Font, size, weight, spacing, decoration
Ombres & Effets	✅ ~88%	Drop/inner shadow, blur, backdrop-filter
Gradient Text	⚠️ ~80%	Via webkit-background-clip technique
Images (fills)	⚠️ ~60%	Placeholder si API Figma non configurée
Composants Figma	⚠️ ~70%	INSTANCE déplié récursivement
---
🔄 Mises à jour
```bash
# Après modification du code :
git add .
git commit -m "fix: description de la correction"
git push

# Vercel redéploie automatiquement en ~60 secondes
```
---
📄 Licence
MIT — Libre d'usage, commercial inclus.