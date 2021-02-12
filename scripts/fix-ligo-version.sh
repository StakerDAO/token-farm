# Truffle uses hardcoded `ligo:next` and we
# need to alias a specific version locally as `next`
docker pull "ligolang/ligo:$1"
docker tag "ligolang/ligo:$1" "ligolang/ligo:next"