FROM node:8.10.0

RUN mkdir -p /usr/src/garie-pagespeed-insights

WORKDIR /usr/src/garie-pagespeed-insights

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
