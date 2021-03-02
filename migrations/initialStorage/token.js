import { MichelsonMap } from "@taquito/taquito";
import { alice, bob, carol } from "../../scripts/sandbox/accounts";
import decimals from '../../decimals-config.json';
import BigNumber from 'bignumber.js';

const initialStorage = {};

initialStorage.base = () => ({
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
    }
});


initialStorage.withBalances = () => {
    const storage = initialStorage.base();
    storage.token.ledger.set(alice.pkh, (new BigNumber(1000).multipliedBy(decimals.rewardToken)).toFixed());
    storage.token.totalSupply = (new BigNumber(1000).multipliedBy(decimals.rewardToken)).toFixed();

    return storage
};

initialStorage.withApprovals = () => {
    const storage = initialStorage.withBalances();
    storage.token.approvals = (() => {
        const map = new MichelsonMap;
        map.set({ // Pair as Key
            0 : bob.pkh, //owner
            1 : carol.pkh //spender
          }, 100000);
        return map;
    })();

    return storage;
};

export default initialStorage;
