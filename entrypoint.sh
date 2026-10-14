#!/bin/sh
set -eu

while [ "$#" -gt 0 ] && [ "$1" = "--" ]; do
  shift
done

if [ "$#" -eq 0 ]; then
  set -- node server.js
fi

exec "$@"
