const axios = require("axios");
require("dotenv").config();

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;
const GA_CLIENT_ID = process.env.GA_CLIENT_ID;
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const GET_EXCHANGE_RATE_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/USD/UAH`;
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

async function fetchExchangeRate() {
  const response = await axios.get(`${GET_EXCHANGE_RATE_URL}`);
  const rate = response.data.conversion_rate;
  console.log(`Fetched USD/UAH rate: ${rate}`);
  return rate;
}

async function sendToGA4(exchangeRate) {
  const payload = {
    client_id: GA_CLIENT_ID,
    events: [
      {
        name: "usd_uah_exchange_rate",
        params: {
          rate: exchangeRate,
          currency: "USD",
        },
      },
    ],
  };

  const response = await axios.post(GA_ENDPOINT, payload);
  console.log("Data sent to GA4:", response.status, response.statusText);
  return response;
}

setInterval(async () => {
  try {
    const rate = await fetchExchangeRate();
    await sendToGA4(rate);
  } catch (error) {
    console.error("Failed to send data to GA4:", error);
  }
}, 3000);
