FROM node

WORKDIR /home/inditeminds-api/

COPY src /home/inditeminds-api/

RUN npm i --production

CMD npm run prod