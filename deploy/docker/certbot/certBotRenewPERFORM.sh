COMPOSE="/usr/local/bin/docker-compose"

$COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP webserver
