FROM node:alpine3.16

RUN apk update && apk add yarn python3 chromium 

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir /www

WORKDIR /www

COPY . .

RUN yarn install

ENTRYPOINT ["sh","/www/launch.sh"]