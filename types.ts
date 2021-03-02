import { MichelsonMap } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";


type address = string;
type delegatorRecord = {
    balance: BigNumber,
    rewardDebt: BigNumber
}
export interface contractStorage {
    lastBlockUpdate: BigNumber,
    accumulatedRewardPerShare: BigNumber,
    plannedRewards: {
        rewardPerBlock: BigNumber,
        totalBlocks: BigNumber
    },
    claimedRewards: {
        unpaid: BigNumber,
        paid: BigNumber
    },
    delegators: MichelsonMap<address, delegatorRecord>,
    reward: BigNumber, // this is only in the mockContract
    lpTokenContract: address,
    farmTokenBalance: BigNumber,
    rewardTokenContract: address
}
export interface mockContractStorage extends contractStorage {
    reward: BigNumber,
}