# Guide de build pour production

## Build du frontend pour production

```bash
cd frontend

# Nettoyer le cache npm si nécessaire
rm -rf node_modules package-lock.json
rm -rf .vite dist

# Réinstaller les dépendances
npm install

# Build pour production
npm run build
```

Le build créera un dossier `dist/` avec les fichiers statiques à servir.

## Vérification du package.json

Si vous avez une erreur JSON, vérifiez le fichier :

```bash
# Vérifier la syntaxe JSON
cat package.json | python3 -m json.tool

# Ou avec node
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"
```

## Si package.json est corrompu

```bash
# Sauvegarder l'ancien fichier
cp package.json package.json.backup

# Recréer le fichier proprement
cat > package.json << 'EOF'
{
  "name": "bureau-clubs-educatifs-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,tsx}\" --max-warnings=0"
  },
  "dependencies": {
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.5",
    "@tanstack/react-query": "^5.90.8",
    "axios": "^1.6.8",
    "chart.js": "^4.4.2",
    "clsx": "^2.1.0",
    "d3": "^7.8.5",
    "dayjs": "^1.11.10",
    "i18next": "^25.6.2",
    "i18next-browser-languagedetector": "^8.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^16.3.3",
    "react-router-dom": "^6.22.3",
    "recharts": "^2.9.0",
    "socket.io-client": "^4.7.5",
    "tailwind-merge": "^2.6.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.9",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.5",
    "vite": "^5.1.6"
  }
}
EOF

# Réinstaller
npm install
npm run build
```

## Configuration Nginx pour servir le frontend

Après le build, configurez Nginx pour servir le dossier `dist/` :

```nginx
location / {
    root /root/buced/frontend/dist;
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache";
}
```

