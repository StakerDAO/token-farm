import { MichelsonMap, UnitValue } from "@taquito/taquito";
import accounts from "../../scripts/sandbox/accounts";
import decimals from '../../decimals-config.json';
import BigNumber from 'bignumber.js';
const initialStorage = {};

initialStorage.base = () => ({
    tzip12: {
        tokensLedger: new MichelsonMap,
        tokenOperators: new MichelsonMap,
        u: UnitValue
    },
    u: UnitValue
});

initialStorage.withBalances = () => {
    const storage = initialStorage.base();
    storage.tzip12.tokensLedger.set({ 0: accounts.walter.pkh, 1: 0 }, (new BigNumber(1000).multipliedBy(decimals.rewardToken)).toFixed());
    
    return storage
};

export default initialStorage;
