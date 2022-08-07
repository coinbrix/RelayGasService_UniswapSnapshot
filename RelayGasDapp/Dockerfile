FROM node:10.19.0
WORKDIR /usr/src/app/appStore/app-store-scraper
COPY appStore/app-store-scraper/package.json .
COPY appStore/app-store-scraper/package-lock.json .
RUN npm install
WORKDIR /usr/src/app/playStore/google-play-scraper
COPY playStore/google-play-scraper/package.json .
COPY playStore/google-play-scraper/package-lock.json .
RUN npm install
WORKDIR /usr/src/app
COPY ../package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
cmd npm run start