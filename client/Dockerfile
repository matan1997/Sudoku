 FROM nginx:alpine
 COPY ./* /usr/share/nginx/html/
 ARG BACKEND_URL=$BACKEND_URL
 ENV BACKEND_URL=$BACKEND_URL
 EXPOSE 80
 CMD ["nginx", "-g", "daemon off;"]