FROM node:23-alpine
# install chromium
COPY ../api  /app/
WORKDIR /app
RUN npm install
EXPOSE 5000
