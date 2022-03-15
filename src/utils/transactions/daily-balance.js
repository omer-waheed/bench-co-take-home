const axios = require('../axios');
const NodeCache = require('node-cache');

const transactionCache = new NodeCache();

/**
 * @param {*} page - Page number
 * @returns - Array of transactions
 */
const getTransactions = async ({ page }) => {
  try {
    const { data } = await axios.get(`/transactions/${page}.json`);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * @param {*} transactions - Array of transactions
 * @returns - Nothing
 */
const calculateDailyBalanceAndUpdateCache = ({ transactions }) => {
  transactions.forEach((transaction) => {
    const { Amount, Date } = transaction;
    if (transactionCache.has(Date)) {
      transactionCache.set(Date, transactionCache.get(Date) + +Amount);
    } else {
      transactionCache.set(Date, +Amount);
    }
  });
};

/**
 * @typedef {Object} Transaction
 * @property {Number} page - Page number
 * @property {Number} visitedRecords - Number of records visited
 * @param {Transaction} options - Options
 * @returns - Nothing
 */
const getAllTransactions = async ({ page = 1, visitedRecord = 0 }) => {
  const data = await getTransactions({ page });
  if (!data) return; // Means there was an error after 3 retries or we have reached the end of the transactions
  visitedRecord += data.transactions.length;

  calculateDailyBalanceAndUpdateCache({ transactions: data.transactions });

  if (visitedRecord < data.totalCount) {
    await getAllTransactions({ page: page + 1, visitedRecord });
  } else {
    return;
  }
};

/**
 * @returns - Nothing
 */
module.exports = async () => {
  await getAllTransactions({});
  return transactionCache.keys().map((e) => {
    return { Date: e, Amount: +transactionCache.get(e).toFixed(2) };
  });
};
