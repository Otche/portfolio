# Portfolio Project

## Terraform resource

- set -a && source ./aws-auth.env && set +a && terraform apply

## Installer  Docker

- ansible-playbook -i ./inventory/host.yml playbook/docker_install.yml

## Docker command

- docker build -t portfolio:0.1 -f porfolio.local.dev.dockerfile .

## Location of site on remote server

- var/www/html/portfolio

sudo chown www-data portfolio/
ps aux | grep Nginx
ps -Al | grep node
sudo systemctl restart Nginx
sudo nano /etc/nginx/sites-available/default

sudo find / -type d -name "_nginx_" => find all Nginx directory

first lang in acceprt-lang : (^fr|^en)\*(fr|en){1}

## DOCKER COMPOSE WRITE AS ROOT PROBLEME TO FIXE

- how setup default user on docker actions
- sudo chmod 775 -R node_modules ssl site

## Test AWS

aws s3 cp --recursive dist s3://bucket-name/dist

## @TODO

- Check vraible font and conversion fonts / when converting ttf to woff , the variation of with is lost
- Check more fonts customization using variable font woff, for title, navigation, ...etc.
- docker run -tid -p 80:80 -v ./nginx/nginx.conf:/etc/nginx/nginx.conf -v ./site:/var/www/html/portfolio portfolio:0.1
