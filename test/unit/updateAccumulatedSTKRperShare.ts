import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import { convertS, toFixedPointString } from '../../helpers/contractDecimalConverter';
import _mockContractHelper from '../helpers/mockContract';

const BN9 = BigNumber.clone({ DECIMAL_PLACES: 9})

contract('updateAccumulatedSTKRperShare()', () => {

    it('', async () => {
      const accumulatedSTKRPerShare = await _mockContractHelper.updateAccumulatedSTKRperShare(
        convertS(new BN9(1000)), // balance
        convertS(new BN9(10)), // reward
          0 // previous acc
        );

      expect(accumulatedSTKRPerShare).to.equal(0)
    });

    // TODO provide test vectors from simulation
});