import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

export default { 
    getCurrentBlockLevel: async function() {
        const Tezos = new TezosToolkit('http://localhost:8732');
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
}