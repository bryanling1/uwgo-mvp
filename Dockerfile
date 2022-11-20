FROM node:lts-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only-prod --force

COPY ./src .

COPY ./public .

COPY .gitignore .

COPY tsconfig.json .

EXPOSE 3000

CMD ["npm", "start"]