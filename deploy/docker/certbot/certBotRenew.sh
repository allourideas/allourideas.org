COMPOSE="/usr/local/bin/docker-compose"

$COMPOSE run certbot renew --dry-run && $COMPOSE kill -s SIGHUP webserver
