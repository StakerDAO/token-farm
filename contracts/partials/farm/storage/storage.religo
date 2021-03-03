#include "types.religo"

type storage = {
    farm: farm,
    delegators: big_map(delegator, delegatorRecord),
    farmLpTokenBalance: nat,
    addresses: addresses
};

#include "delegatorsRepository.religo"
#include "setAccumulatedRewardPerShare.religo"
#include "setLastBlockUpdate.religo"
#include "setUnpaidRewards.religo"
#include "setPaidRewards.religo"
#include "setFarmLpTokenBalance.religo"
