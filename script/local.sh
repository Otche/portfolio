if [ ! -d "ssl" ]; then
    mkdir ssl
fi
npm i
npm run site:build
npm run api:start:dev