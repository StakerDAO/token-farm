import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, UnitValue } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import accounts from "../../scripts/sandbox/accounts";
import { contractStorage, delegatorRecord } from "./types";

const farm = artifacts.require('farm');


const testHelpers = (instance, Tezos) => {
    return {
        instance: instance,
        Tezos: Tezos,
        getStorage: async function(): Promise<contractStorage> {
            return await instance.storage();
        },
        getClaimedRewards: async function(){
            return (await this.getStorage()).farm.claimedRewards
        },
        getAccumulatedRewardPerShare: async function(): Promise<BigNumber> {
           return (await this.getStorage()).farm.accumulatedRewardPerShare;
        },
        deposit: async function(value, options) {
            const operation = await this.instance.methods.deposit(value).send(options);
            await operation.confirmation(1);
            return operation;
        },
        claim: async function(options) {
            const operation = await this.instance.methods.claim(UnitValue).send({...options, storageLimit: 120});
            await operation.confirmation(1);
            return operation;
        },
        getUnpaidRewards: async function(): Promise<BigNumber> {
            return (await this.getClaimedRewards()).unpaid;
        },
        getPaidRewards: async function(): Promise<BigNumber> {
            return (await this.getClaimedRewards()).paid;
        },
        getFarmLpTokenBalance: async function(): Promise<BigNumber> {
            return (await this.getStorage()).farmLpTokenBalance;
        },
        getDelegatorRecord: async function(address): Promise<delegatorRecord> {
            return (await (await this.getStorage()).delegators.get(address))
        },
        getDelegatorBalance: async function(address): Promise<BigNumber> {
            return (await this.getDelegatorRecord(address)).lpTokenBalance;
        },
        getDelegatorStakingStart: async function(address): Promise<BigNumber> {
            return (await this.getDelegatorRecord(address)).accumulatedRewardPerShareStart;
        },
        getPlannedRewards: async function() {
            return (await this.getStorage()).farm.plannedRewards;
        },
        getRewardPerBlock: async function() {
            return (await this.getPlannedRewards()).rewardPerBlock;
        },
        getTotalBlocks: async function() {
            return (await this.getPlannedRewards()).totalBlocks;
        },
        getLastBlockUpdate: async function(): Promise<number> {
            return (await this.getStorage()).farm.lastBlockUpdate.toNumber()
        },
        withdraw: async function(amount, options) {
            const operation = await this.instance.methods.withdraw(amount).send({...options, storageLimit: 200});
            await operation.confirmation(1);
            return operation
        },
        updatePlan: async function(rewardPerBlock, totalBlocks, options) {
            const operation = await this.instance.methods.updatePlan(rewardPerBlock, totalBlocks).send(options);
            await operation.confirmation(1);
            return operation
        },
        setAdmin: async function(address, options) {
            const operation = await this.instance.methods.setAdmin(address).send(options);
            await operation.confirmation(1);
            return operation
        },
        getAdmin: async function(): Promise<string> {
            return (await this.getStorage()).addresses.admin;
        },
        escape: async function(options) {
            const operation = await this.instance.methods.escape(UnitValue).send(options);
            await operation.confirmation(1);
            return operation
        },
        withdrawProfit: async function(address, options) {
            const operation = await this.instance.methods.withdrawProfit(address).send(options);
            await operation.confirmation(1);
            return operation
        }
    };
};

export default {
    originate: async function(initalStorage) {
        const instance = await farm.new(initalStorage)
        console.log('Farm contract originated at', instance.address);
        
        const testHelpers = await this.at(instance.address);
        return testHelpers;
    },
    at: async function(address) {
        // TODO move to taquito helper
        const Tezos = new TezosToolkit(tezos._rpcClient.url);
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });
        

        const instance = await Tezos.contract.at(address);
        
        return testHelpers(instance, Tezos);
    },
};
