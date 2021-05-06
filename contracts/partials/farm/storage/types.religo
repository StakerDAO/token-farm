type delegator = address;
type delegatorRecord = {
    lpTokenBalance: nat,
    accumulatedRewardPerShareStart: nat,
};

type getBalanceParameter = 
[@layout:comb]
{
    owner: address,
    callback: contract(nat),
};

type getBalanceResponse = nat;

#if TOKEN_FA2
type transferContents = 
[@layout:comb]
{
    to_: address,
    token_id: nat,
    amount: nat
};

type transfer = 
[@layout:comb]
{
    from_: address,
    txs: list(transferContents)
};

type transferParameter = list(transfer);
#else
type transferParameter = 
[@layout:comb]
{
    [@annot:from] from_: address,
    [@annot:to] to_: address,
    value: nat,
};
#endif

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
    lastBlockUpdate: nat,
    accumulatedRewardPerShare: nat,
    claimedRewards: claimedRewards,
    plannedRewards: plannedRewards
};

type addresses = {
    admin: address,
    lpTokenContract: address,
    rewardTokenContract: address,
    rewardReserve: address,
};

#if TOKEN_FA2
type tokenId = nat;
type tokenIds = {
    lp: tokenId,
    reward: tokenId,
};
#endif
