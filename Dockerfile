FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# MVP 단계 로컬 개발 환경용 설정
CMD ["npm", "run", "dev"]
