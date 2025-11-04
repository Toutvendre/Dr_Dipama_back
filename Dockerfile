# =========================
# Étape 1 : Builder l’application
# =========================
FROM node:22-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration package.json + tsconfig.json
COPY package*.json tsconfig.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm install

# Copier le code source TypeScript
COPY ./src ./src

# Compiler le code TypeScript dans /dist
RUN npm run build

# =========================
# Étape 2 : Image finale de production
# =========================
FROM node:22-alpine AS production

WORKDIR /app

# Copier package.json + package-lock.json et /dist depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# Exposer le port
EXPOSE 8080

# CMD : lancer le seed admin compilé puis le serveur
CMD ["sh", "-c", "npm run seed:adminprod && node dist/index.js"]
