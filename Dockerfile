# Node.js 기반 이미지 선택 
FROM node:20

# 앱 디렉토리 생성 및 작업 디렉토리 설정
WORKDIR /home/node/app

# package.json과 package-lock.json 파일을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 기본 실행 포트
EXPOSE 4000

# 앱 실행 명령어
CMD ["npm", "start"]
