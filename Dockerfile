FROM node:latest

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]