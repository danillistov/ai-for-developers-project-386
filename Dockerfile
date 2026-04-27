# Stage 1: Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/front
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
RUN VITE_API_BASE_URL= npm run build

# Stage 2: Build backend (includes native module compilation for Alpine/musl)
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
RUN apk add --no-cache python3 make g++
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:22-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./package.json
COPY --from=frontend-builder /app/front/dist ./public
ENV PORT=4010
EXPOSE $PORT
CMD ["node", "dist/main"]
