FROM nginx
#COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/ssl/certs/
COPY default.conf /etc/nginx/conf.d/
COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/fullchain.pem /etc/ssl_certs/fullchain.pem
COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/privkey.pem /etc/ssl_certs/privkey.pem
COPY ./.htpasswd /etc/nginx/.htpasswd

EXPOSE 8443