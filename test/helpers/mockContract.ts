import { InMemorySigner } from '@taquito/signer';
import { ContractAbstraction, ContractProvider, TezosToolkit, UnitValue } from '@taquito/taquito';
import accounts from '../../scripts/sandbox/accounts';
import initialStorage from '../../migrations/initialStorage/mockContract';
import { mockContractStorage } from '../../types';

const unitTestContract = artifacts.require('mockContract');

const testHelpers = (instance: ContractAbstraction<ContractProvider>) => {
    return {
        instance: instance,
        calculateReward: async function(address: string) {
            const operation = await instance.methods.calculateReward(
                address
            ).send();
            await operation.confirmation(1);
            return operation;
        },
        getStorage: async function(): Promise<mockContractStorage> {
            return await instance.storage<mockContractStorage>();
        },
        getReward: async function(): Promise<string> {
            return (await this.getStorage()).reward.toFixed();
        },
        getAccumulatedRewardPerShare: async function(): Promise<string> {
           return (await this.getStorage()).accumulatedRewardPerShare.toFixed();
        },
        requestBalance: async function(address: string) {
            const operation = await instance.methods.requestBalance(
                address
            ).send();
            await operation.confirmation(1);
            return operation;
        },
        updateAccumulatedRewardPerShare: async function(balance, reward) {
            const operation = await instance.methods.updateAccumulatedRewardPerShare(
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
        },
        updatePool: async function() {
            const operation = await instance.methods.updatePool(UnitValue).send({storageLimit: 100});
            await operation.confirmation(1);
            return operation;
        }
    };
};

export default {
    originate: async function(initialStorage) {
        const instance = await unitTestContract.new(initialStorage);
        console.log('MockContract originated at', instance.address);
        
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
    calculateReward: async function(balance, rewardDebt, accumulatedRewardPerShare): Promise<string> {
        const initialTestStorage = initialStorage.test.calculateReward(
            accounts.alice.pkh,
            balance,
            rewardDebt,
            accumulatedRewardPerShare
        );
        const contract = await this.originate(initialTestStorage);

        const operation = await contract.calculateReward(accounts.alice.pkh); 
        await operation.confirmation(1);

        return await contract.getReward();
    },
    // TODO expose almost all properties of initial storage
    updatePoolWithRewards: async function(balance, blockLevel): Promise<number> {
        const contract = await this.originate(initialStorage.base())

        await contract.updatePoolWithRewards(balance, blockLevel);

        return await contract.getAccumulatedRewardPerShare();
    },
    updateAccumulatedRewardPerShare: async function(
            balance: string, 
            reward: string, 
            previousAccumulatedRewardPerShare: string
        ): Promise<string> {
        const contract = await this.originate(
            initialStorage.test.updateAccumulatedRewardPerShare(previousAccumulatedRewardPerShare)
        );

        await contract.updateAccumulatedRewardPerShare(balance, reward)

        return await contract.getAccumulatedRewardPerShare();
    },
    updatePool: async function(initialStorage): Promise<mockContractStorage> {
        const contract = await this.originate(initialStorage);

        await contract.updatePool();

        return await contract.getStorage()
    }
};
