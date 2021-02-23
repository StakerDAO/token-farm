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

#include "../storage/delegatorsRepository.religo"
#include "../storage/setAccumulatedSTKRperShare.religo"
#include "../storage/setLastBlockUpdate.religo"
#include "../storage/setUnrealizedRewards.religo"
#include "../storage/setFarmTokenBalance.religo"
