#!/usr/bin/env bash

source 'envs/.envvars.test'

# function cleanupDB {
#   echo "remove SQLite DB"
#   rm -rf /tmp/lockerroom.db
# }

function run {
  "$@"
  local status=$?
  if [ $status -ne 0 ]; then
    # cleanupDB
    exit 1
  fi
  return $status
}

if [ "$NODE_ENV" == "test" ]; then
  if psql -lqt | cut -d \| -f 1 | grep -w ${DB_NAME}; then
    echo "${DB_NAME} database already exists...moving on"
  else
    echo "${DB_NAME} database does not exist"
    echo "...create TEST user $DB_USER with password $DB_PASS"
    psql -c "create user \"$DB_USER\" with password '$DB_PASS'"

    echo "...create TEST database $DB_NAME with owner $DB_USER encoding='utf8' template template0"
    psql -c "create database \"$DB_NAME\" with owner \"$DB_USER\" encoding='utf8' template template0"
  fi
fi

# run npm run gulp lint

run lab \
  --verbose \
  --transform 'test/_helpers/transformer.js' \
  --sourcemaps \
  --ignore __core-js_shared__,core,Reflect,_babelPolyfill,regeneratorRuntime
