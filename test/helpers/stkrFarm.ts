import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, UnitValue } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import accounts from "../../scripts/sandbox/accounts";

const stkr = artifacts.require('stkr');

interface stkrStorage {
    accumulatedSTKRPerShare: BigNumber,
    lastBlockUpdate: BigNumber,
    reward: BigNumber
}

const testHelpers = (instance, Tezos) => {
    return {
        instance: instance,
        Tezos: Tezos,
        getStorage: async function(): Promise<stkrStorage> {
            return await instance.storage();
        },
        getClaimedRewards: async function(){
            return (await this.getStorage()).claimedRewards
        },
        getAccumulatedSTKRPerShare: async function(): Promise<number> {
           return (await this.getStorage()).accumulatedSTKRPerShare.toNumber();
        },
        deposit: async function(value) {
            const operation = await this.instance.methods.deposit(value).send();
            await operation.confirmation(1);
            return operation;
        },
        claim: async function() {
            const operation = await this.instance.methods.claim(UnitValue).send({storageLimit: 100});
            await operation.confirmation(1);
            return operation;
        },
        increaseBlock: async function() {
            const operation = await this.Tezos.contract.transfer({ to: accounts.dave, amount: 1 });
            await operation.confirmation(1);
        },
        getUnpaidRewards: async function(): Promise<number> {
            return (await this.getClaimedRewards()).unpaid.toNumber();
        },
        getPaidRewards: async function(): Promise<BigNumber> {
            return (await this.getClaimedRewards()).paid;
        },
        getFarmTokenBalance: async function(): Promise<BigNumber> {
            return (await this.getStorage()).farmTokenBalance;
        },
        getDelegatorBalance: async function(address) {
            return (await (await this.getStorage()).delegators.get(address)).balance.toNumber();
        },
        getPlannedRewards: async function() {
            return (await this.getStorage()).plannedRewards;
        },
        getRewardsPerBlock: async function() {
            return await this.getPlannedRewards().rewardPerBlock;
        },
        getLastBlockUpdate: async function(): Promise<number> {
            return (await this.getStorage()).lastBlockUpdate.toNumber()
        },
        getDelegatorRewardDebt: async function(address): Promise<BigNumber> {
            return (await (await this.getStorage()).delegators.get(address)).rewardDebt;
        },
    };
};

export default {
    originate: async function(initalStorage) {
        const instance = await stkr.new(initalStorage)
        console.log('Originated farm at', instance.address);
        
        const testHelpers = await this.at(instance.address);
        return testHelpers;
    },
    at: async function(address) {
        // TODO move to taquito helper
        const Tezos = new TezosToolkit('http://localhost:8732');
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });
        

        const instance = await Tezos.contract.at(address);
        
        return testHelpers(instance, Tezos);
    },
};
