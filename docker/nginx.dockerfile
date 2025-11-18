FROM nginx:latest
COPY ../nginx/nginx.prod.conf /etc/nginx/nginx.conf
COPY ../site /var/www/html/portfolio
COPY ../ssl /etc/nginx/ssl