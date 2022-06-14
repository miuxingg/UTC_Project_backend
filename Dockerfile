FROM python3:latest-alpine

FROM node:14.18.0-alpine

WORKDIR /app

COPY . .

RUN apk --no-cache add --virtual builds-deps build-base python

RUN yarn 

COPY . .

EXPOSE 8081

CMD ["yarn",  "start"]
