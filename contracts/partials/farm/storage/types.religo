type delegator = address;
type delegatorRecord = {
    accumulatedRewardPerShareStart: nat,
    lpTokenBalance: nat,
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
