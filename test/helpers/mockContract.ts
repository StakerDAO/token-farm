import { InMemorySigner } from '@taquito/signer';
import { ContractAbstraction, ContractProvider, TezosToolkit, UnitValue } from '@taquito/taquito';
import accounts from '../../scripts/sandbox/accounts';
import { mockContractStorage } from '../../types';

const unitTestContract = artifacts.require('mockContract');

const testHelpers = (instance: ContractAbstraction<ContractProvider>) => {
    return {
        instance: instance,
        getStorage: async function(): Promise<mockContractStorage> {
            return await instance.storage<mockContractStorage>();
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
        const Tezos = new TezosToolkit(tezos._rpcClient.url);
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });

        const instance = await Tezos.contract.at(address);
        
        return testHelpers(instance);
    },
    updatePool: async function(initialStorage): Promise<mockContractStorage> {
        const contract = await this.originate(initialStorage);

        await contract.updatePool();

        return await contract.getStorage()
    }
};
