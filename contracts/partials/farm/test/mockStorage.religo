#include "../storage/types.religo"

type claimedRewards = {
    unpaid: nat,
    paid: nat
};

type plannedRewards = {
    totalBlocks: nat,
    rewardPerBlock: nat,
};

type storage = {
    lastBlockUpdate: nat,
    accumulatedRewardPerShare: nat,
    claimedRewards: claimedRewards,
    plannedRewards: plannedRewards,
    delegators: big_map(delegator, delegatorRecord),
    reward: nat,
    lpTokenContract: address,
    farmTokenBalance: nat,
    rewardTokenContract: address
};

#include "../storage/delegatorsRepository.religo"
#include "../storage/setAccumulatedRewardPerShare.religo"
#include "../storage/setLastBlockUpdate.religo"
#include "../storage/setUnpaidRewards.religo"
#include "../storage/setPaidRewards.religo"
#include "../storage/setFarmTokenBalance.religo"
