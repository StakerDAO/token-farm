#include "types.religo"

type storage = {
    farm: farm,
    delegators: big_map(delegator, delegatorRecord),
    farmLpTokenBalance: nat,
    addresses: addresses
};

#include "delegatorsRepository.religo"
#include "farmRepository.religo"
#include "setFarmLpTokenBalance.religo"
#include "setAdminProperty.religo"
