import BigNumber from 'bignumber.js';
import { expect } from 'chai';
import _mockContractHelper from '../../helpers/mockContract';

const BN9 = BigNumber.clone({ DECIMAL_PLACES: 9})
const e18 = '1000000000000000000';
const e12 = '1000000000000';
const e9 = '1000000000';

contract('updateAccumulatedRewardPerShare()', () => {
//let accumulatedRewardPerShare = storage.accumulatedRewardPerShare + reward * fixedPointAccuracy / contractBalance; // 21 + 18/9=9 *12
    it('', async () => {
      const accumulatedRewardPerShare = await _mockContractHelper.updateAccumulatedRewardPerShare(
        (new BigNumber(1000).multipliedBy(e9)).toFixed(), // balance
        (new BigNumber(10).multipliedBy(e18)).toFixed(), // reward
          0 // previous acc
        );

      expect(accumulatedRewardPerShare).to.equal((new BigNumber('10000000')).multipliedBy(e12).toFixed())
    });
    it.skip('', async () => {
        const accumulatedRewardPerShare = await _mockContractHelper.updateAccumulatedRewardPerShare(
          (new BigNumber(1234).multipliedBy(e9)).toFixed(), // balance
          (new BigNumber(10).multipliedBy(e18)).toFixed(), // reward
            0 // previous acc
          );
  
        expect(accumulatedRewardPerShare).to.equal((new BigNumber('8103727')).multipliedBy(e12).toFixed())
      });

    it('', async () => {
        const balance = (new BigNumber(3).multipliedBy(e9)).toFixed();
        const reward = (new BigNumber(10).multipliedBy(e18)).toFixed();
        const accumulatedRewardPerShare = await _mockContractHelper.updateAccumulatedRewardPerShare(
          balance, // balance
          reward, // reward
            0 // previous acc
          );

          const clientComputation = (new BigNumber(reward)).dividedBy(new BigNumber(balance))
          console.log('client before', clientComputation.toFixed())
          const rewardClientFixedPoint = (clientComputation.multipliedBy(new BigNumber(e12)).decimalPlaces(0,1)).toFixed()
            console.log(rewardClientFixedPoint)
        expect(accumulatedRewardPerShare).to.equal(rewardClientFixedPoint)
      });

      it.only('', async () => {
        const balance = (new BigNumber(100).multipliedBy(e9)).toFixed();
        const reward = (new BigNumber(10).multipliedBy(e18)).toFixed();
        const accumulatedRewardPerShare = await _mockContractHelper.updateAccumulatedRewardPerShare(
          balance, // balance
          reward, // reward
            0 // previous acc
          );

          const clientComputation = (new BigNumber(reward)).dividedBy(new BigNumber(balance))
          console.log('client before', clientComputation.toFixed())
          const rewardClientFixedPoint = (clientComputation.multipliedBy(new BigNumber(e12)).decimalPlaces(0,1)).toFixed()
            console.log(rewardClientFixedPoint)
        expect(accumulatedRewardPerShare).to.equal('100000000000000000000')
        expect(rewardClientFixedPoint).to.equal('100000000000000000000')
      });

    // TODO provide test vectors from simulation
});