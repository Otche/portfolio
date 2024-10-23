# @TODO

- Check vraible font and conversion fonts / when converting ttf to woff , the variation of with is lost
- Check more fonts customization using variable font woff, for title, navigation, ...etc.
- docker run -tid -p 80:80 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -v ./site:/var/www/html/portfolio portfolio:0.1


-var/www/html/portfolio  

sudo chown www-data portfolio/
ps aux | grep Nginx
ps -Al | grep node
sudo systemctl restart Nginx
sudo nano  /etc/nginx/sites-available/default

 sudo find / -type d -name "*nginx*" => find all Nginx directory



first lang in acceprt-lang : (^fr|^en)*(fr|en){1}
check if uri : ^\/(fr|en)