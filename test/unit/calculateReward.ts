//const { expect } = require('chai').use(require('chai-as-promised'));
import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';
import { convert, convertBalance } from '../../helpers/contractDecimalConverter';

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
                convertBalance(balance),
                convert(rewardDebt),
                convert(accumulatedSTKRPerShare)
            );
            
            expect(computedReward).to.equal(convert(reward));
        });
    }

    describe('test various computations', () => {
        success(
            'with decimal',
            10,
            0,
            1.1234,
            11.234
        ),
        success(
            'with reward debt',
            10,
            1,
            1,
            9
        ),
        success(
            'no reward debt',
            10,
            0,
            150,
            1500
        ),
        success(
            'simple',
            50,
            0,
            15,
            750
        ),
        success(
            'todo',
            1.5,
            0,
            14.77832512315271,
            22.16748
        ),
        success(
            'todo',
            100,
            0,
            14.77832512315271,
            1477.83251
        ),
        success(
            'todo',
            0.1222,
            0,
            4919.929241959677,
            601.21535
        )
    });
});

