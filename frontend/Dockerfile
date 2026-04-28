FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build
RUN npm install -g serve
# Cloud Run automatically sets the PORT environment variable to 8080
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]
