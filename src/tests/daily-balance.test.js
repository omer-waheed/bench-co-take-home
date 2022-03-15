const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { dailyBalance } = require('../utils/transactions');

describe('Daily balance module', () => {
  it('Should retrive transactions', async () => {
    chai.use(chaiAsPromised);
    chai.should();

    const transactions = await dailyBalance();
    transactions.should.be.an('array');
    transactions.length.should.be.above(0);
  });
});
