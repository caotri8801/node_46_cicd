FROM node:20.12.2-alpine


WORKDIR /home/app

COPY package*.json .


#~5 phút
RUN npm install --timeout=300000

#. ĐẦU TIÊN ĐỨNG NGAY DIRECTORY(BE-CYBER-MEDIA)
#. THỨ 02 ĐƯA VÀO /HOME/APP
COPY . .

#tạo prisma client bên trong
RUN npx prisma generate

#vô package.json sửa "dev" và "start" lên production ko cần chạy nodemon
CMD ["npm","run","start" ]