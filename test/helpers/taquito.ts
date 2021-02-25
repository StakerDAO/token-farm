import { TezosToolkit } from "@taquito/taquito";

export default { 
    getCurrentBlockLevel: async function() {
        const Tezos = new TezosToolkit('http://localhost:8732');
        return (await Tezos.rpc.getBlock()).header.level
    }
}