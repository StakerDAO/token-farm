#include "types.religo"

type claimedRewards = {
    unpaid: nat,
    paid: nat,
};

type plannedRewards = {
    totalBlocks: nat,
    rewardPerBlock: nat,
};

type storage = {
    lastBlockUpdate: nat,
    accumulatedSTKRPerShare: nat,
    claimedRewards: claimedRewards,
    plannedRewards: plannedRewards,
    delegators: big_map(delegator, delegatorRecord),
    lpTokenContract: address,
    farmTokenBalance: nat,
    stkrTokenContract: address,
};

#include "delegatorsRepository.religo"
#include "setAccumulatedSTKRperShare.religo"
#include "setLastBlockUpdate.religo"
#include "setUnpaidRewards.religo"
#include "setPaidRewards.religo"
#include "setFarmTokenBalance.religo"
