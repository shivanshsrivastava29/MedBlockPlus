const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config(); // Load .env variables

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.error("❌ Missing Pinata API credentials in .env file");
  process.exit(1); // Exit the app if keys are not found
}

async function uploadToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  // ✅ Validate file existence
  if (!fs.existsSync(filePath)) {
    console.error("❌ File does not exist:", filePath);
    return null;
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const headers = {
    ...formData.getHeaders(),
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_API_SECRET,
  };

  try {
    const response = await axios.post(url, formData, { headers });

    console.log("✅ File pinned to IPFS:", response.data.IpfsHash);
    return response.data; // { IpfsHash, PinSize, Timestamp }
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("❌ Pinata upload failed:", errData);
    return null;
  }
}

module.exports = uploadToPinata;
