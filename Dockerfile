FROM node:latest

ENV NODE_PATH=/usr/local/lib/node_modules

RUN useradd -d /home/ejsql -m -s /bin/bash ejsql && \
    mkdir /usr/local/src/ejsql && \
    chown ejsql /usr/local/src/ejsql && \
    chmod 755 /usr/local/src/ejsql

WORKDIR /usr/local/src/ejsql
COPY . ./
RUN chown -R ejsql:ejsql .

USER ejsql

RUN npm install

CMD npm run smoke
