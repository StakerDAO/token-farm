import { expect } from 'chai';
import _mockContractHelper from '../helpers/mockContract';

contract('updateAccumulatedSTKRperShare()', () => {

    it('', async () => {
      const accumulatedSTKRPerShare = await _mockContractHelper.updateAccumulatedSTKRperShare(10, 100, 1);

      expect(accumulatedSTKRPerShare).to.equal(0)
    });

    // TODO provide test vectors from simulation
});