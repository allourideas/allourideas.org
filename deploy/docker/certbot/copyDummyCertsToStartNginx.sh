if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

mkdir -p webserver/letsEncryptCerts/live
cp -R webserver/self_signed_temporary_insecure_pre_lets_encrypt_certs webserver/letsEncryptCerts/live/$CERTBOT_CERT_FOLDER
