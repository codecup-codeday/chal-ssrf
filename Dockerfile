FROM node:alpine3.16

RUN apk update && apk add yarn python3 chromium 

# configure puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# setup files
RUN mkdir /www

WORKDIR /www

COPY . .

RUN yarn install

RUN chmod 700 launch.sh

ENTRYPOINT ["sh","/www/launch.sh"]