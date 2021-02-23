#include "types.religo"

type storage = {
    lastBlockUpdate: nat,
    accumulatedSTKRPerShare: nat,
    rewardPerBlock: nat,
    unrealizedRewards: nat,
    realizedRewards: nat,
    totalBlocks: nat,
    delegators: big_map(delegator, delegatorRecord),
    lpTokenContract: address,
    farmTokenBalance: nat,
    stkrTokenContract: address
};

#include "getDelegator.religo"
#include "setAccumulatedSTKRperShare.religo"
#include "setLastBlockUpdate.religo"
#include "setUnrealizedRewards.religo"
#include "setDelegator.religo"
#include "setFarmTokenBalance.religo"
#include "decreaseDelegatorBalance.religo"
