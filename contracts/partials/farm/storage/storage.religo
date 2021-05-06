#include "types.religo"

type storage = {
    farm: farm,
    delegators: big_map(delegator, delegatorRecord),
    farmLpTokenBalance: nat,
    addresses: addresses,
#if TOKEN_FA2
    tokenIds: tokenIds,
#endif
};

#include "delegatorsRepository.religo"
#include "farmRepository.religo"
#include "setFarmLpTokenBalance.religo"
#include "setAdminProperty.religo"
