#include "../storage/types.religo"

type claimedRewards = {
    unpaid: nat,
    paid: nat,
};

type plannedRewards = {
    rewardPerBlock: nat,
    totalBlocks: nat,
};

type farm = {
    accumulatedRewardPerShare: nat,
    claimedRewards: claimedRewards,
    lastBlockUpdate: nat,
    plannedRewards: plannedRewards,
};

type addresses = {
    admin: address,
    lpTokenContract: address,
    rewardReserve: address,
    rewardTokenContract: address,
};


type storage = {
    addresses: addresses,
    delegators: big_map(delegator, delegatorRecord),
    farm: farm,
    farmLpTokenBalance: nat,
    reward: nat // for testing with mockContract
};

#include "../storage/delegatorsRepository.religo"
#include "../storage/farmRepository.religo"
#include "../storage/setFarmLpTokenBalance.religo"
