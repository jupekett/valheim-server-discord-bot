#!/bin/bash

cd scripts # Or avoid cd by setting working directory when launching test process
source ../.env
readarray -t messages < <(envsubst < server-test-log)

for ((i = 0; i < ${#messages[@]}; i++)); do
    echo -n "${messages[$i]}"
    sleep 0.5 
done
