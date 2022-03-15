const { dailyBalance } = require('./utils/transactions');
const loading = require('loading-cli');

/**
 * @returns - Nothing
 */
module.exports = async () => {
  const load = loading('Calculating daily balances').start();
  const transactions = await dailyBalance();
  load.stop();

  console.table(transactions);
};
