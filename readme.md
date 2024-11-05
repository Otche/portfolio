# @TODO

- Check vraible font and conversion fonts / when converting ttf to woff , the variation of with is lost
- Check more fonts customization using variable font woff, for title, navigation, ...etc.
- docker run -tid -p 80:80 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -v ./site:/var/www/html/portfolio portfolio:0.1

# docker command

- docker build -t portfolio:0.1 -f porfolio.local.dev.dockerfile .
- docker run -tid -p 80:80 -p 443:443 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -v ./site:/var/www/html/portfolio -v ./ssl-certificate/localhost.cer:/etc/nginx/ssl/localhost.cer -v ./ssl-certificate/localhost.key:/etc/nginx/ssl/localhost.key portfolio:0.1

- whithout detach : docker run -ti -p 80:80 -p 443:443 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -v ./site:/var/www/html/portfolio -v ./ssl-certificate/localhost.cer:/etc/nginx/ssl/localhost.cer -v ./ssl-certificate/localhost.key:/etc/nginx/ssl/localhost.key portfolio:0.1

-var/www/html/portfolio

sudo chown www-data portfolio/
ps aux | grep Nginx
ps -Al | grep node
sudo systemctl restart Nginx
sudo nano /etc/nginx/sites-available/default

sudo find / -type d -name "_nginx_" => find all Nginx directory

first lang in acceprt-lang : (^fr|^en)\*(fr|en){1}
check if uri : ^\/(fr|en)
