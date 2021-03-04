#include "../storage/types.religo"

type claimedRewards = {
    unpaid: nat,
    paid: nat,
};

type plannedRewards = {
    totalBlocks: nat,
    rewardPerBlock: nat,
};

type farm = {
    lastBlockUpdate: nat,
    accumulatedRewardPerShare: nat,
    claimedRewards: claimedRewards,
    plannedRewards: plannedRewards
};

type addresses = {
    admin: address,
    lpTokenContract: address,
    rewardTokenContract: address,
    rewardReserve: address
};


type storage = {
    farm: farm,
    delegators: big_map(delegator, delegatorRecord),
    farmLpTokenBalance: nat,
    addresses: addresses,
    reward: nat // for testing with mockContract
};

#include "../storage/delegatorsRepository.religo"
#include "../storage/setAccumulatedRewardPerShare.religo"
#include "../storage/setLastBlockUpdate.religo"
#include "../storage/setUnpaidRewards.religo"
#include "../storage/setPaidRewards.religo"
#include "../storage/setFarmLpTokenBalance.religo"
