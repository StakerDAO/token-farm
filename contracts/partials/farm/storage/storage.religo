#include "types.religo"

type storage = {
    addresses: addresses,
    delegators: big_map(delegator, delegatorRecord),
    farm: farm,
    farmLpTokenBalance: nat,
};

#include "delegatorsRepository.religo"
#include "farmRepository.religo"
#include "setFarmLpTokenBalance.religo"
#include "setAdminProperty.religo"
