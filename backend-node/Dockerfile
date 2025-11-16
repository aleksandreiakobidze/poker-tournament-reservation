FROM node:18-alpine
WORKDIR /usr/src/app
COPY backend-node/package.json ./
RUN npm install --omit=dev
COPY backend-node/ ./
EXPOSE 3000
CMD ["npm", "start"]
