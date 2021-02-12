#include "types.religo"

type storage = {
    lastBlockUpdate: nat,
    accumulatedSTKRPerShare: nat,
    rewardPerBlock: nat,
    unrealizedRewards: nat,
    realizedRewards: nat,
    totalBlocks: nat,
    delegators: big_map(delegator, delegatorRecord)
};

#include "getDelegator.religo"
#include "setAccumulatedSTKRperShare.religo"
#include "setLastBlockUpdate.religo"
#include "setUnrealizedRewards.religo"
