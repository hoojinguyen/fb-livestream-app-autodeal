#! /bin/bash
CMD=$1
shift
REST=$@

PREFIX=""
SUDO=""

if [ "$NODE_ENV" == "production" ]; then
  PREFIX="docker-compose -f docker-compose.yml"
  SUDO="sudo"
else
  PREFIX="docker-compose"
fi

if [ "$CMD" == "start" ]; then
  eval "$PREFIX up -d"
elif [ "$CMD" == "stop" ]; then
  eval "$PREFIX down"
elif [ "$CMD" == "restart" ]; then
  eval "$PREFIX down"
  eval "$PREFIX up -d"
elif [ "$CMD" == "migrate" ]; then
  eval "$PREFIX exec app knex migrate:$REST"
elif [ "$CMD" == "npmi" ]; then
  eval "$PREFIX exec app npm install"
  eval "$PREFIX restart app"
  eval "$SUDO $PREFIX build app"
elif [ "$CMD" == "pm2" ]; then
  eval "$PREFIX exec app pm2 $REST"
elif [ "$CMD" == "--" ]; then
  eval "$PREFIX $REST"
else
  echo "invalid command"
fi