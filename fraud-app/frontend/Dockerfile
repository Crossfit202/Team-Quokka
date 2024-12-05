FROM node:current-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g http-server

CMD ["http-server", "./dist/my-first-angular/browser", "-p", "4200"]

EXPOSE 4200