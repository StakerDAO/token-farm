//const { expect } = require('chai').use(require('chai-as-promised'));
import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import { convertL, convertM, convertS } from '../../helpers/contractDecimalConverter';
import BigNumber from 'bignumber.js';

const BN21 = BigNumber.clone({ DECIMAL_PLACES: 21})
const BN27 = BigNumber.clone({ DECIMAL_PLACES: 27})
const BN9 = BigNumber.clone({ DECIMAL_PLACES: 9})


contract('calculateReward()', () => {
    // balance * accumulatedSTKRPerShare - rewardDebt * fixedPointAccuracy

    function success(
        description, 
        balance, 
        rewardDebt, 
        accumulatedSTKRPerShare, 
        reward) {
        it(description, async () => {
            const computedReward = await _mockContractHelper.calculateReward(
                convertS(new BN9(balance)),
                convertL(new BigNumber(rewardDebt)),
                "33333333333333333333"//convertM(new BN27(accumulatedSTKRPerShare))
            );
            console.log("balance", convertS(new BN9(balance)))
            console.log("length", convertS(new BN9(balance)).length)
            console.log("accumulated", convertM(new BN21(accumulatedSTKRPerShare)));
            console.log("length", convertM(new BN21(accumulatedSTKRPerShare)).length);
            expect(computedReward).to.equal(convertS(new BN9(reward)));
        });
    }

    describe('test various computations', () => {
        // success(
        //     '',
        //     100,
        //     0,
        //     0.1,
        //     10
        // ),
        // success(
        //     '',
        //     1000,
        //     0,
        //     0.01,
        //     10
        // ), 
        success( //33_333_333_333_333_330_000 20
            '',
            30,
            0,
            0.03333333333333333333333333,
            0.99999999
        ),
        success(
            '',
            300,
            0,
            0.033333333333333333,
            10
        ),
        success(
            '',
            3000,
            0,
            0.033_333_333_333_333_333_333_333_333,
            100
        ),
        /**
         * it seems that michelson multiplication precision stops at 17 decimals.
         * 18 decimals * 27 decimals / 18 decimals
         * 45 / 18
         * 27 decimals
         * it rounds up at 17 decimals
         */
        success( 
            '',
            30_000,
            0,
            0.033_333_333_333_333_333_333_333_333,
            1_000
        ),
        success( 
            '',
            3_000_000_000,
            0,
            0.033_333_333_333_333_333_333_333_333,
            100_000_000
        ),
        success( 
            '',
            30_000_000_000,
            0,
            0.033_333_333_333_333_333_333_333_333,
            1_000_000_000
        )
        // success(
        //     'no reward debt',
        //     10,
        //     0,
        //     150,
        //     1500
        // ),
        // success(
        //     'simple',
        //     50,
        //     0,
        //     15,
        //     750
        // ),
        // success(
        //     'todo',
        //     1.5,
        //     0,
        //     14.77832512315271,
        //     22.16748
        // )
        // success(
        //     'todo',
        //     100,
        //     0,
        //     14.77832512315271,
        //     1477.83251
        // ),
        // success(
        //     'todo',
        //     0.1222,
        //     0,
        //     4919.929241959677,
        //     601.21535
        // )
    });
});

