import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit, UnitValue } from "@taquito/taquito";
import BigNumber from "bignumber.js";
import initialStorage from "../../migrations/initialStorage/unitTest";
import accounts from "../../scripts/sandbox/accounts";

const stkr = artifacts.require('stkr');


interface stkrStorage {
    accumulatedSTKRPerShare: BigNumber,
    lastBlockUpdate: BigNumber,
    reward: BigNumber
};

const testHelpers = (instance) => {
    return {
        instance: instance,
        Tezos: TezosToolkit,
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
            const operation = await this.instance.methods.claim(UnitValue).send();
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
        getPaidRewards: async function(): Promise<number> {
            return (await this.getClaimedRewards()).paid.toNumber();
        }
    };
};

export default {
    originate: async function(initalStorage) {
        const instance = await stkr.new(initalStorage)
        console.log('Originated at', instance.address);
        
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
        
        return testHelpers(instance);
    },
};
