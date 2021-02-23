import { InMemorySigner } from "@taquito/signer";
import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import accounts, { alice, bob, carol } from "../../scripts/sandbox/accounts";
import tokenContractMichelson from "../../contracts/main/stkr/test/tokenTzip7.json"

const initialStorage: any = {};

initialStorage.base = {
    token: {
        ledger: new MichelsonMap,
        approvals: new MichelsonMap,
        admin: alice.pkh,
        pauseGuardian: alice.pkh,
        paused: false,
        totalSupply: 0,
    },
    bridge: {
        swaps: new MichelsonMap,
        outcomes: new MichelsonMap,
        lockSaver: alice.pkh,
    },
};


initialStorage.withBalances = {
    ...initialStorage.base,
    token: {
        ...initialStorage.base.token,
        ledger: MichelsonMap.fromLiteral({
            [alice.pkh]: 100000000000000000
        }),
        totalSupply: 100000000000000000,
    },
};

initialStorage.withApprovals = {
    ...initialStorage.withBalances,
    token: {
        ...initialStorage.withBalances.token,
        approvals:  (()=> {
            const map = new MichelsonMap;
            map.set({ // Pair as Key
                0 : bob.pkh, //owner
                1 : carol.pkh //spender
              }, 100000);
            return map;
        })()
    },
};

const tzip7Helpers = (instance) => {
    return {
        instance: instance,
        setAdministrator: async function(administratorAddress) {
            const operation = await instance.methods
                .setAdministrator(administratorAddress)
                .send();
            return await operation.confirmation(1);
        },
        getStorage: async function() {
            return await instance.storage();
        },
        getAdministrator: async function() {
            return (await this.getStorage()).token.admin;
        },
        getPauseGuardian: async function() {
            return (await this.getStorage()).token.pauseGuardian
        },
        getBalance: async function(address) {
            const balance = await (await this.getStorage()).token.ledger.get(address) || 0;
            return Number(balance);
        },
        setPause: async function(boolean) {
            const operation = await instance.methods.setPause(boolean).send();
            await operation.confirmation(1);
            return operation
        },
        getPauseState: async function() {
            return (await this.getStorage()).token.paused;
        },
        approve: async function(spender, value) {
            const operation = await instance.methods.approve(
                spender,
                value
            ).send();
            await operation.confirmation(1);
            return operation
        },
        approveCAS: async function(expected, spender, value) {
            const operation = await instance.methods.approveCAS(
                expected, // expected allowance value
                spender,
                value
            ).send();
            await operation.confirmation(1);
            return operation
        },
        mint: async function(tokenOwner, value) {
            const operation = await instance.methods.mint(
                tokenOwner,
                value
            ).send();
            await operation.confirmation(1);
            return operation
        },
        burn: async function(tokenOwner, value) {
            const operation = await instance.methods.burn(
                tokenOwner,
                value
            ).send();
            await operation.confirmation(1);
            return operation
        },
        getAllowance: async function(owner, spender) {
            // michelson pair as key
            const key = {
                0: owner, 
                1: spender
            };
            const approvals = (await this.getStorage()).token.approvals;
            const allowanceValue = await approvals.get(key) || 0;
            return Number(allowanceValue);
        },
        transfer: async function(transferParameters) {
            const operation = await instance.methods.transfer(
                transferParameters.from,
                transferParameters.to,
                transferParameters.value
            ).send();
            await operation.confirmation(1);
            return operation
        },
        getTotalSupply: async function() {
            const totalSupply = (await this.getStorage()).token.totalSupply;
            return totalSupply.toNumber()
        },
        setPauseGuardian: async function(pauseGuardianAddress) {
            const operation = await instance.methods
                .setPauseGuardian(pauseGuardianAddress)
                .send();
            return await operation.confirmation(1);
        },
        lock: async function(swap) {
            const operation = await instance.methods
                .lock(
                    swap.confirmed,
                    swap.fee,
                    swap.releaseTime,
                    swap.secretHash,
                    swap.to,
                    swap.value)
                .send();
            return operation.confirmation(1);
        },
        getSwap: async function(swapId) {
            const swap = await (await this.getStorage()).bridge.swaps.get(swapId);
            if (swap != undefined) {
                swap.fee = swap.fee.toNumber();
                swap.value = swap.value.toNumber();
            };
            return swap;
        },
        confirmSwap: async function(secretHash) {
            const operation = await instance.methods
                .confirmSwap(secretHash)
                .send();
            return operation.confirmation(1);
        },
        redeem: async function(secret, swapInitiator) {
            const operation = await instance.methods
                .redeem(secret, swapInitiator)
                .send();
            return operation.confirmation(1);
        },
        getOutcomes: async function(secretHash) {
            const outcome = await (await this.getStorage()).bridge.outcomes.get(secretHash);
            return outcome;
        },
        getAllowanceFromStorage: async function(storage, owner, spender) {
            // michelson pair
            const key = {
                0: owner,
                1: spender
            };
            const allowance = await storage.token.approvals.get(key) || 0;
            return Number(allowance);
        },
        claimRefund: async function(secretHash) {
            const operation = await instance.methods
                .claimRefund(secretHash)
                .send();
            return operation.confirmation(1);
        }
    }
}

export default {
    originate: async function() {
        const Tezos = new TezosToolkit('http://localhost:8732');
        Tezos.setProvider({
            signer: await InMemorySigner.fromSecretKey(accounts.alice.sk)
        });
        const operation = await Tezos.contract
            .originate({
                code: tokenContractMichelson,
                storage: initialStorage.withApprovals,
            });
        console.log('Token contract originated at', operation.contractAddress);
        const instance = await operation.contract();
        return tzip7Helpers(instance)
    }
};
