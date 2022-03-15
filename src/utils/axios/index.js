const axios = require('axios');
const axiosRetry = require('axios-retry');
const { BASE_URL } = require('../../config');

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {},
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryCondition: (error) => error.response.status !== 404,
});

module.exports = axiosInstance;
