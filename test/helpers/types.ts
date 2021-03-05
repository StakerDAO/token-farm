import { MichelsonMap } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";


type address = string;
export type delegatorRecord = {
    balance: BigNumber,
    stakingStart: BigNumber
}
export interface contractStorage {
    farm: {
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
    },
    delegators: MichelsonMap<address, delegatorRecord>,
    farmLpTokenBalance: BigNumber,
    addresses: {
        admin: address,
        lpTokenContract: address,
        rewardTokenContract: address,
        rewardReserve: address
    }
}
export interface mockContractStorage extends contractStorage {
    reward: BigNumber,
}