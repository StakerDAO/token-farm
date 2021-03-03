type delegator = address;
type delegatorRecord = {
    balance: nat,
    stakingStart: nat,
};

type getBalanceParameter = 
[@layout:comb]
{
    owner: address,
    callback: contract(nat),
};

type getBalanceResponse = nat;

type transferParameter = 
[@layout:comb]
{
    [@annot:from] from_: address,
    [@annot:to] to_: address,
    value: nat,
};

type updatePoolAction = Skip | UpdateBlock | UpdateRewards;

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
    lpTokenContract: address,
    rewardTokenContract: address,
    rewardReserve: address
};
