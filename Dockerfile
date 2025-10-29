# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim AS production
WORKDIR /app

# Install fontconfig for font management
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm install --production

# Copy built app from the build stage
COPY --from=build /app/dist ./dist

ENV NODE_ENV production
CMD ["node", "dist/index.js"]
