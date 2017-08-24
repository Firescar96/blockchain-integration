#!/bin/bash

ACCOUNT=$(geth account | grep -Eo "Account #0: {[a-z0-9]+}" | grep -Eo "[a-z0-9]{40}")
node app | sed -e 's/^/[node] /' & swarm --bzzaccount "$ACCOUNT" --ens-api='' --maxpeers 0 --corsdomain "*" <<< '' | sed -e 's/^/[swarm] /'