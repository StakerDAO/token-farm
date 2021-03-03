import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { Operation } from "@taquito/taquito/dist/types/operations/operations";
import accounts from "../../scripts/sandbox/accounts";

export default { 
    getCurrentBlockLevel: async function() {
        const Tezos = new TezosToolkit(tezos._rpcClient.url);
        return (await Tezos.rpc.getBlock()).header.level
    },
    signAs: async (secretKey, helper, fn) => {
        const oldSigner = helper.Tezos.signer;
        
        const signer = (await InMemorySigner.fromSecretKey(secretKey));
        helper.Tezos.setProvider({
            signer: signer
        });
        // run the function using the new temporary signer
        const output = await fn();
        // revert the signer back to the old signer
        helper.Tezos.setProvider({
            signer: oldSigner
        });
        return output;
    },
    increaseBlock: async function(blocks) {
        const Tezos = new TezosToolkit(tezos._rpcClient.url);
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });
        for (let block = 0; block < blocks; block++) {
            const operation = await Tezos.contract.transfer({ to: accounts.dave.pkh, amount: 1 });
            await operation.confirmation(1);
        }
        return
    },
}