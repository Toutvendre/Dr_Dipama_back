# Étape 1 : Builder l’application
FROM node:22-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json tsconfig.json ./

# Installer les dépendances (production + dev)
RUN npm install

# Copier le code source
COPY ./src ./src

# Compiler le code TypeScript
RUN npm run build

# Étape 2 : Image finale de production
FROM node:22-alpine AS production

# Répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# Exposer le port (Render choisira automatiquement PORT)
EXPOSE 8080

# Étape supplémentaire : lancer le seed admin avant le serveur
# Astuce : on le fait dans le CMD, juste avant de démarrer Node
CMD npm run seed:admin && node dist/index.js
