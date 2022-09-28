FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf

ARG CERTBOT_CERT_FOLDER
ENV CERTBOT_CERT_FOLDER=$CERTBOT_CERT_FOLDER

RUN mkdir -p /etc/ssl/certs/
RUN openssl dhparam -out /etc/ssl/certs/dhparam-2048.pem 2048

#RUN mkdir -p /etc/letsencrypt/live/$DOMAIN_NAME/
#COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/fullchain.pem /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem
#COPY ./self_signed_temporary_insecure_pre_lets_encrypt_certs/privkey.pem /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem
#RUN ls -l /etc/letsencrypt/live/$DOMAIN_NAME/

#RUN mkdir -p /etc/letsencrypt/live/$CERTBOT_CERT_FOLDER/
#RUN touch /etc/letsencrypt/live/$CERTBOT_CERT_FOLDER/test.text
#RUN ls -l /etc/letsencrypt/live/$CERTBOT_CERT_FOLDER/

#RUN ls -l /etc/letsencrypt
