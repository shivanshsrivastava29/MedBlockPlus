const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const QRCode = require("qrcode");
const crypto = require("crypto");
const uploadToPinata = require("./pinataupload");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Initialize Firebase
const serviceAccount = require("./firebaseConfig.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ✅ Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 // serve QR from here
app.use(express.static("public"));


// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

//upload
app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to IPFS
    const ipfsResult = await uploadToPinata(filePath);
    if (!ipfsResult) return res.status(500).send("IPFS upload failed.");

    const ipfsHash = ipfsResult.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    // Save to Firestore
    const metadata = {
      filename: req.file.originalname,
      ipfsHash,
      sha256: hash,
      timestamp: new Date().toISOString(),
    };
    await db.collection("files").add(metadata);

   // Generate QR Code with verification link
const appUrl = `http://localhost:${PORT}/verify?ipfs=${ipfsHash}&sha=${hash}`;
const qrFileName = `qr-${Date.now()}.png`;
const qrPath = path.join(__dirname, "uploads", qrFileName); // Save to uploads folder

await QRCode.toFile(qrPath, appUrl); // Save QR image to file

// ✅ Send JSON response to frontend
res.json({
  success: true,
  ipfsUrl,
  hash,
  qrPath: `/uploads/${qrFileName}`, // Needed so <img src="..."> works properly
});


  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    res.status(500).json({ success: false, error: "Upload failed. Please try again." });
  }
});


// ✅ Verification Route
app.get("/verify", async (req, res) => {
  const { ipfs, sha } = req.query;
  if (!ipfs || !sha) {
    return res.send("❌ Invalid QR or missing data.");
  }

  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfs}`;

  res.send(`
    <h2>🛡️ File Verification</h2>
    <p>🔗 IPFS URL: <a href="${ipfsUrl}" target="_blank">${ipfsUrl}</a></p>
    <p>🔐 SHA-256: ${sha}</p>
    <p>📄 Preview:</p>
    <iframe src="${ipfsUrl}" width="100%" height="500px" style="border:1px solid #ccc;"></iframe>
  `);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
