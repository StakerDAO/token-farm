import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import BigNumber from 'bignumber.js';

import accounts from "../../scripts/sandbox/accounts";
import tokenFA2ContractMichelson from "../../contracts/main/farm/test/tokenTzip12-FA2.json"
import decimals from '../../decimals-config.json';
import _initialStorage from '../../migrations/initialStorage/tokenFA2';

export const tokenId = 0;

const tzip12Helpers = (instance, Tezos) => {
    return {
        instance: instance,
        Tezos: Tezos,
        transfer: async function(transferParameters) {
            const operation = await instance.methods.transfer([{
                from_: transferParameters.from,
                txs: [{
                    to_: transferParameters.to,
                    token_id: tokenId,
                    amount: transferParameters.value
                }]
            }]).send();

            await operation.confirmation(1);
            return operation
        },
        add_operator: async function(owner, spender) {
            const operation = await instance.methods.update_operators(
                [{
                    'add_operator': {
                        owner: owner,
                        operator: spender
                    }
                }]
            ).send();
            await operation.confirmation(1);
            return operation
        },
        getStorage: async function() {
            return await instance.storage();
        },
        getBalance: async function(address): Promise<BigNumber> {
            const balance = await (await this.getStorage())
                .tzip12
                .tokensLedger
                .get(
                    { 0: address, 1: tokenId }
                ) || new BigNumber(0);
            return balance;
        },

    }
}

export function rewardToken(value): string {
    return (new BigNumber(value)).multipliedBy(new BigNumber(decimals.rewardToken)).toFixed();
}

export function lpToken(value): string {
    return (new BigNumber(value)).multipliedBy(new BigNumber(decimals.lpToken)).toFixed();
}

export default {
    originate: async function(contract?: string) {

        const Tezos = new TezosToolkit(tezos._rpcClient.url);
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });
        
        const operation = await Tezos.contract
            .originate({
                code: tokenFA2ContractMichelson,
                storage: _initialStorage.withBalances(),
            });
        console.log(contract + ' Token contract originated at', operation.contractAddress);
        const instance = await operation.contract();

        return tzip12Helpers(instance, Tezos)
    }
};
