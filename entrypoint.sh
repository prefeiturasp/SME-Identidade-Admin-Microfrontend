#!/bin/sh
set -eu

envsubst '${NEXT_PUBLIC_ADMIN_MS_URL} ${NEXT_PUBLIC_ADMIN_CLIENT_ID} ${NEXT_PUBLIC_ADMIN_CLIENT_SECRET} ${REALM_FINALIDADES_TESTE} ${REALM_FINALIDADE_PADRAO} ${REALM_HEADER}' \
  < /app/public/env.js.template \
  > /app/public/env.js

while [ "$#" -gt 0 ] && [ "$1" = "--" ]; do
  shift
done

if [ "$#" -eq 0 ]; then
  set -- node server.js
fi

exec "$@"
