FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf

ARG CERTBOT_CERT_FOLDER
ENV CERTBOT_CERT_FOLDER=$CERTBOT_CERT_FOLDER

RUN mkdir -p /etc/ssl/certs/
RUN openssl dhparam -out /etc/ssl/certs/dhparam-2048.pem 2048

