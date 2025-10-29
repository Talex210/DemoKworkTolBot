# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Install fontconfig and other necessary font packages
# 'fontconfig' is essential for font management on Linux systems.
# If you need specific fonts, you can install them here, e.g., fonts-noto-color-emoji
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    # Example of installing a common font package, uncomment if needed:
    # fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

# If you have custom fonts (e.g., .ttf, .otf files), place them in a 'fonts' directory
# in your project root. Then uncomment the following lines to copy and register them:
# COPY fonts/ /usr/local/share/fonts/
# RUN fc-cache -f -v

# Copy only necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# Set environment variables
ENV NODE_ENV production

# Expose the port your application listens on (e.g., 3000)
# EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
