const unitTestContract = artifacts.require('mockContract');
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import accounts from '../../scripts/sandbox/accounts';
import initialStorage from '../../migrations/initialStorage/unitTest';

interface testStorage {
    accumulatedSTKRPerShare: BigNumber,
    lastBlockUpdate: BigNumber,
    reward: BigNumber
};

const testHelpers = (instance) => {
    return {
        instance: instance,
        calculateReward: async function(address: string) {
            const operation = await instance.methods.calculateReward(
                address
            ).send();
            await operation.confirmation(1);
            return operation;
        },
        getStorage: async function(): Promise<testStorage> {
            return await instance.storage();
            //return await instance.storage<testStorage>();
        },
        getReward: async function(): Promise<number> {
            return (await this.getStorage()).reward.toNumber();
        },
        getAccumulatedSTKRPerShare: async function(): Promise<number> {
           return (await this.getStorage()).accumulatedSTKRPerShare.toNumber();
        }
    };
};

export default {
    originate: async function(initialStorage) {
        const instance = await unitTestContract.new(initialStorage);
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
    calculateReward: async function(balance, rewardDebt, accumulatedSTKRPerShare): Promise<number> {
        const initialTestStorage = initialStorage.test.calculateReward(
            accounts.alice.pkh,
            balance,
            rewardDebt, // rewardDebt
            accumulatedSTKRPerShare // accumulatedSTKRperShare
        );
        const contract = await this.originate(initialTestStorage);

        const operation = await contract.calculateReward(accounts.alice.pkh); 
        await operation.confirmation(1);

        return await contract.getReward();
    },
    // TODO expose almost all properties of initial storage
    updatePool: async function(balance, blockLevel): Promise<number> {
        const contract = await this.originate(initialStorage.base)

        const operation = await contract.methods.updatePool(balance, blockLevel).send();
        await operation.confirmation(1);

        return await contract.getAccumulatedSTKRPerShare();
    },
    updateAccumulatedSTKRperShare: async function(balance, reward, previousAccumulatedSTKRPerShare): Promise<Number> {
        const contract = await this.originate(initialStorage.test.updateAccumulatedSTKRperShare(previousAccumulatedSTKRPerShare));

        const operation = await contract.methods.updateAccumulatedSTKRperShare(balance, reward).send();
        await operation.confirmation(1);

        return await contract.getAccumulatedSTKRPerShare();
    }
};
