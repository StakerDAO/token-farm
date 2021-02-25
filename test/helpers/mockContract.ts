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
        getReward: async function(): Promise<string> {
            return (await this.getStorage()).reward.toFixed();
        },
        getAccumulatedSTKRPerShare: async function(): Promise<string> {
           return (await this.getStorage()).accumulatedSTKRPerShare.toFixed();
        },
        requestBalance: async function(address: string) {
            const operation = await instance.methods.requestBalance(
                address
            ).send();
            await operation.confirmation(1);
            return operation;
        },
        updateAccumulatedSTKRperShare: async function(balance, reward) {
            const operation = await instance.methods.updateAccumulatedSTKRperShare(
                balance, 
                reward
            ).send()
            await operation.confirmation(1);
            return operation;
        },
        updatePoolWithRewards: async function(balance, blockLevel) {
            const operation = await instance.methods.updatePoolWithRewards(balance, blockLevel).send();
            await operation.confirmation(1);
            return operation;
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
    calculateReward: async function(balance, rewardDebt, accumulatedSTKRPerShare): Promise<string> {
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
    updatePoolWithRewards: async function(balance, blockLevel): Promise<number> {
        const contract = await this.originate(initialStorage.base)

        await contract.updatePoolWithRewards(balance, blockLevel);

        return await contract.getAccumulatedSTKRPerShare();
    },
    updateAccumulatedSTKRperShare: async function(balance, reward, previousAccumulatedSTKRPerShare): Promise<string> {
        const contract = await this.originate(initialStorage.test.updateAccumulatedSTKRperShare(previousAccumulatedSTKRPerShare));

        await contract.updateAccumulatedSTKRperShare(balance, reward)

        return await contract.getAccumulatedSTKRPerShare();
    },
    requestBalance: async function(ownerAddress, tokenContractAddress): Promise<number> {
        const contract = await this.originate(initialStorage.test.requestBalance(tokenContractAddress))
        
        await contract.requestBalance(ownerAddress);
        
        return await contract.getReward()
    }
};
