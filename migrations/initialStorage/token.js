import { MichelsonMap } from "@taquito/taquito";
import accounts from "../../scripts/sandbox/accounts";
import decimals from '../../decimals-config.json';
import BigNumber from 'bignumber.js';

const initialStorage = {};

initialStorage.base = () => ({
    token: {
        admin: accounts.alice.pkh,
        approvals: new MichelsonMap,
        ledger: new MichelsonMap,
        paused: false,
        pauseGuardian: accounts.alice.pkh,
        totalSupply: 0,
    },
    bridge: {
        lockSaver: accounts.lock.pkh,
        outcomes: new MichelsonMap,
        swaps: new MichelsonMap,
    }
});


initialStorage.withBalances = () => {
    const storage = initialStorage.base();
    storage.token.ledger.set(accounts.walter.pkh, (new BigNumber(1000).multipliedBy(decimals.rewardToken)).toFixed());
    storage.token.totalSupply = (new BigNumber(1000).multipliedBy(decimals.rewardToken)).toFixed();

    return storage
};

initialStorage.withApprovals = () => {
    const storage = initialStorage.withBalances();
    storage.token.approvals = (() => {
        const map = new MichelsonMap;
        map.set({ // Pair as Key
            0 : accounts.bob.pkh, //owner
            1 : accounts.carol.pkh //spender
          }, 100000);
        return map;
    })();

    return storage;
};

export default initialStorage;
