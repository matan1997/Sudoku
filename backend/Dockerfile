 FROM node:alpine
 WORKDIR /app
 COPY ["package.json", "package-lock.json*", "./"]
 COPY ./ ./
 ENV DB_HOST=$DB_HOST
 RUN echo "url is $DB_HOST"
 EXPOSE 3000
 RUN npm i
 CMD ["npm", "start"]



