FROM node:23 AS frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy frontend source code
COPY frontend ./

# Copy frontend environment variables
COPY frontend/.env .env

# Build React app
RUN yarn build

EXPOSE 3000
EXPOSE 4173

CMD ["yarn", "preview","--host","0.0.0.0"]