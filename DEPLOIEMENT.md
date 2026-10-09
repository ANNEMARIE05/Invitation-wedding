# Déploiement — Invitation mariage

Site **React sur Vercel** + **API Express + SQLite sur Railway**.

> Vercel seul ne peut pas garder un fichier `wedding.db` : le disque serverless est éphémère.  
> La base SQLite vit sur **Railway**, avec un **volume persistant** monté sur `/data`.

---

## Architecture

| Composant | Hébergeur | Rôle |
|-----------|-----------|------|
| Front (`build/`) | Vercel | Invitation, RSVP, livre d’or (UI) |
| API (`server/`) | Railway | SQLite, auth admin, photos, réglages |
| Base | Fichier sur volume Railway | `DATABASE_PATH=/data/wedding.db` |

Fichiers de config déjà dans le repo : `vercel.json`, `railway.toml`, `nixpacks.toml`, `Procfile`.

---

## Variables d’environnement

### Local — `.env.local` (racine du projet)

```env
COUPLE_PASSWORD=votre_mot_de_passe
PORT=3001
# DATABASE_PATH=./data/wedding.db
```

Lancer : `npm install` puis `npm start` (API port 3001 + React port 3000, proxy `/api`).

---

### Railway (API)

| Variable | Exemple | Obligatoire |
|----------|---------|-------------|
| `COUPLE_PASSWORD` | `Hesed-MS-13` | Oui |
| `DATABASE_PATH` | `/data/wedding.db` | Oui (avec volume) |
| `ALLOWED_ORIGINS` | `https://mon-site.vercel.app` | Oui en prod |
| `NODE_ENV` | `production` | Recommandé |
| `WEDDING_DATE_ISO` | `2026-12-04T13:30:00.000Z` | Optionnel |

Plusieurs origines : `ALLOWED_ORIGINS=https://a.vercel.app,https://www.mondomaine.fr`

**Volume Railway (obligatoire)** : Settings → Volumes → Mount Path **`/data`**.

---

### Vercel (front)

| Variable | Exemple | Quand |
|----------|---------|--------|
| `REACT_APP_API_URL` | `https://xxx.up.railway.app` | **Build** (sans `/` final) |

Create React App lit cette variable **au moment du build**. Si vous la changez, **redéployez** Vercel.

---

## Déploiement sur Render (Recommandé)

Render permet de déployer l'API directement depuis GitHub grâce au fichier `render.yaml` (Blueprint) ou via un Web Service.

### Méthode 1 — Automatique via Blueprint (render.yaml)
1. Rendez-vous sur le dashboard : [dashboard.render.com](https://dashboard.render.com/).
2. Cliquez sur **New +** → **Blueprint**.
3. Sélectionnez le dépôt GitHub `ANNEMARIE05/Invitation-wedding`.
4. Render détecte automatiquement `render.yaml` avec les réglages appropriés :
   - Service : `invitation-wedding-api`
   - Node : 22
   - Commande de build : `npm install`
   - Commande de start : `npm run start:api`
   - Health check : `/api/health`
5. Cliquez sur **Apply**.
6. Une fois le déploiement terminé, copiez l'URL fournie par Render (ex. `https://invitation-wedding-api.onrender.com`).

### Méthode 2 — Manuelle (Web Service)
1. Sur [dashboard.render.com](https://dashboard.render.com/), cliquez sur **New +** → **Web Service**.
2. Connectez le dépôt GitHub `ANNEMARIE05/Invitation-wedding`.
3. Paramétrez les champs suivants :
   - **Name** : `invitation-wedding-api`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm run start:api`
   - **Plan** : Free
4. Dans **Advanced** → **Environment Variables**, ajoutez :
   - `NODE_VERSION` = `22` (impératif pour supporter `node:sqlite`)
   - `NODE_ENV` = `production`
   - `COUPLE_PASSWORD` = `Hesed-MS-13`
   - `ALLOWED_ORIGINS` = `https://invitation-wedding-eta.vercel.app`
   - `DATABASE_PATH` = `./data/wedding.db`
5. Dans **Health Check Path**, indiquez `/api/health`.
6. Cliquez sur **Deploy Web Service**.

---

## Étape 1 — Railway (API, alternative)

1. Compte [railway.app](https://railway.app) → connecter GitHub.
2. **New Project** → **Deploy from GitHub** → ce dépôt.
3. **Settings → Networking** → **Generate Domain** → noter l’URL (ex. `https://invitation-api.up.railway.app`).
4. **Settings → Volumes** → **Add Volume** → Mount Path : **`/data`**.
5. **Settings → Variables** : voir tableau Railway ci-dessus (`ALLOWED_ORIGINS` peut être provisoire, corrigé à l’étape 3).
6. Test : `https://VOTRE-URL-RAILWAY.app/api/health` → `{"ok":true}`.

Commande de démarrage (déjà configurée) : `npm run start:api`  
Healthcheck : `/api/health`

---

## Étape 2 — Vercel (site)

Le site est déjà déployé sur Vercel : `https://invitation-wedding-eta.vercel.app/`

Si ce n'est pas encore fait ou pour mettre à jour la liaison :
1. Dans le projet Vercel → **Settings** → **Environment Variables**.
2. Ajoutez ou modifiez la variable :
   - `REACT_APP_API_URL` = URL Render de votre API (ex. `https://invitation-wedding-api.onrender.com`, sans slash final `/`).
3. Allez dans l'onglet **Deployments** et lancez un **Redeploy** (Create React App intègre les variables au moment du build).

---

## Étape 3 — Relier Vercel et Render (ou Railway)

1. Sur Render → Service `invitation-wedding-api` → **Environment** :
   - Vérifiez que `ALLOWED_ORIGINS` = `https://invitation-wedding-eta.vercel.app` (sans slash final).
2. Vérifier CORS : depuis le site Vercel, le formulaire RSVP et le livre d’or doivent fonctionner sans erreur réseau.
3. Connexion **espace mariés** : cookie envoyé vers le domaine de l'API ; `ALLOWED_ORIGINS` + cookie `SameSite=None` (déjà géré dans le code).

---

## Étape 4 — Tests

- [ ] Accueil, programme, lieux
- [ ] RSVP (création + recherche par numéro)
- [ ] Livre d’or
- [ ] `/espace-maries` → mot de passe `COUPLE_PASSWORD`
- [ ] `/reponses`, `/photos`, `/infos` (admin)

---

## Schéma SQL

Le fichier `sql/schema.sql` est chargé au démarrage de l’API. La base est créée automatiquement dans `DATABASE_PATH`.

---

## Dépannage

| Problème | Piste |
|----------|--------|
| RSVP / livre d’or vides ou erreurs | API Railway down ou `REACT_APP_API_URL` incorrect → rebuild Vercel |
| « Impossible de joindre le serveur » (login mariés) | API arrêtée ou mauvaise URL |
| Admin : connexion puis déconnecté | `ALLOWED_ORIGINS` ≠ URL Vercel exacte ; HTTPS requis |
| Données perdues après redeploy Railway | Volume non monté sur `/data` ou `DATABASE_PATH` incorrect |
| Node trop ancien sur Railway | Le repo exige Node **≥ 22.5** (`node:sqlite`) — voir `nixpacks.toml` |

---

## Production sans Vercel (optionnel)

Sur un VPS : `npm run build` puis `NODE_ENV=production node server/index.js` — le serveur peut aussi servir le dossier `build/` si présent.
