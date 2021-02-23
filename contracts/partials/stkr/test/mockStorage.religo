#include "../storage/types.religo"

type storage = {
    lastBlockUpdate: nat,
    accumulatedSTKRPerShare: nat,
    unrealizedRewards: nat,
    rewardPerBlock: nat,
    realizedRewards: nat,
    totalBlocks: nat,
    delegators: big_map(delegator, delegatorRecord),
    reward: nat,
    lpTokenContract: address,
    farmTokenBalance: nat,
    stkrTokenContract: address
};

#include "../storage/getDelegator.religo"
#include "../storage/setAccumulatedSTKRperShare.religo"
#include "../storage/setLastBlockUpdate.religo"
#include "../storage/setUnrealizedRewards.religo"
#include "../storage/setDelegator.religo"
#include "../storage/setFarmTokenBalance.religo"
#include "../storage/decreaseDelegatorBalance.religo"
