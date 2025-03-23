# Use Node.js 23 as the base image
FROM node:23 AS backend

WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy backend source code
COPY backend ./

# Copy backend environment variables
COPY backend/.env .env

EXPOSE 3001
CMD ["yarn", "start"]
