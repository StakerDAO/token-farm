//const { expect } = require('chai').use(require('chai-as-promised'));
import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import { convertL, convertM, convertS } from '../../helpers/contractDecimalConverter';
import BigNumber from 'bignumber.js';

const BN21 = BigNumber.clone({ DECIMAL_PLACES: 21})
const BN30 = BigNumber.clone({ DECIMAL_PLACES: 30})
const BN18 = BigNumber.clone({ DECIMAL_PLACES: 18})
const BN27 = BigNumber.clone({ DECIMAL_PLACES: 27})
const BN9 = BigNumber.clone({ DECIMAL_PLACES: 9})

const e9 = '1000000000';
const e18 = '1000000000000000000';
const e21 = '1000000000000000000000';
const e27 = '1000000000000000000000000000';

contract('calculateReward()', () => {
    // balance * accumulatedSTKRPerShare - rewardDebt * fixedPointAccuracy

    function success(
        description, 
        balance, 
        rewardDebt, 
        accumulatedSTKRPerShare, 
        ) {
        it(description, async () => {
            const rewardSmartContract = await _mockContractHelper.calculateReward(
                (new BN9(balance)).multipliedBy(new BigNumber(e9)).toFixed(),
                convertL(new BigNumber(rewardDebt)),
                (new BN21(accumulatedSTKRPerShare)).multipliedBy(new BigNumber(e21)).toFixed()
            );
            
            console.log('0.1', (new BN21(accumulatedSTKRPerShare)).multipliedBy(new BigNumber(e21)).toFixed())
            const clientComputation = (new BN9(balance)).multipliedBy(new BN21(accumulatedSTKRPerShare))
            console.log('client before', clientComputation.toFixed())
            const rewardClientFixedPoint = (clientComputation.multipliedBy(new BigNumber(e18)).decimalPlaces(0,1)).toFixed()
            
            console.log(rewardSmartContract)
            expect(rewardSmartContract).to.equal(rewardClientFixedPoint);
        });
    }

    it.skip('asdf', async () => {
        const raw = new BigNumber('999.99999999999999999');
        const result = raw.decimalPlaces(0,1)
        
        console.log(result.toFixed())
        console.log((raw.multipliedBy(new BigNumber('1000000000')).decimalPlaces(0,1)).toFixed())
    })

    describe('LP 9 decimals, STKR 18 decimals, accSTKR/share 21 decimals', () => {
        success(
            '',
            100,
            0,
            0.1
        ),
        success(
            '',
            1000,
            0,
            0.01
        ), 
        // success( //33_333_333_333_333_330_000 20
        //     '',
        //     30,
        //     0,
        //     '0.033333333333333333333',
        //     '0.99999999999999999999' //20
        // ),
        // success(
        //     '',
        //     300,
        //     0,
        //     0.033333333333333333,
        //     '9.9999999999999999999'
        // ),
        // success(
        //     '',
        //     3000,
        //     0,
        //     0.033_333_333_333_333_333_333_333_333,
        //     100
        // ),
        /**
         * it seems that michelson multiplication precision stops at 17 decimals.
         * 18 decimals * 27 decimals / 18 decimals
         * 45 / 18
         * 27 decimals
         * it rounds up at 17 decimals
         */
        success( 
            '',
            '30000',
            0,
            '0.033333333333333333333',
        ),
        success( 
            '',
            '3000000000',
            0,
            '0.033333333333333333333'
        ),
        success( 
            '',
            30000000000,
            0,
            '0.033333333333333333333',
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

