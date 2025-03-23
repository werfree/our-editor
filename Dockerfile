# # Build Frontend
# FROM node:23-alpine AS frontend
# WORKDIR /app
# COPY frontend/package.json frontend/yarn.lock ./
# RUN yarn install
# COPY frontend ./
# COPY frontend/.env.prod .env
# RUN yarn build
# RUN ls -l /app/dist

# Build Backend
FROM node:23-alpine AS backend
WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install
COPY backend ./
COPY backend/public ./public
RUN yarn build

# Copy frontend build to backend's public directory
# COPY --from=frontend /app/dist /app/public

EXPOSE 3001
CMD ["node", "dist/index.js"]
