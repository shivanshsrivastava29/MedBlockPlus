# 🔐 MedBlockPlus – Secure Medical Record Verifier

MedBlockPlus is a secure, blockchain-inspired file integrity verifier that ensures the authenticity of sensitive documents like medical records, certificates, and transcripts using **SHA-256 hashing**, **IPFS via Pinata**, and **Firebase Authentication**.

---

## 🌟 Features

- 🔐 User Authentication (Email, Google, GitHub via Firebase)
- 🚀 Secure File Upload (SHA-256 hash + Pinata IPFS)
- ✅ File Integrity Verification (via hash comparison)
- 📂 Re-upload file to verify authenticity
- ✨ Glowing, modern Glassmorphism UI with Tailwind CSS
- ⚡ Realtime animated particle background
- 🔒 Private key & Firebase configs secured via `.env`

---

## 🖼️ Screenshots
shown in screenshots folder

---

## 🔧 Tech Stack

| Tech              | Description                                |
|------------------|--------------------------------------------|
| **Tailwind CSS** | For modern responsive glowing UI           |
| **Firebase**     | Auth (Email, Google, GitHub) & Storage     |
| **IPFS (Pinata)**| Distributed file storage                   |
| **CryptoJS**     | SHA-256 hashing for file fingerprints      |
| **Node.js**      | Backend upload + hash logic                |
| **dotenv**       | To secure sensitive keys and config        |

---

## 📂 Folder Structure
├── public/
├── uploads/
├── screenshots/
├── index.html(inside public)
├── index.js
├── pinataupload.js
├── firebaseConfig.json (🔒 ignored in .gitignore)
├── .env (🔒 not committed)
├── package.json

---

## 🚀 Setup & Run

# Clone the repo
git clone https://github.com/your-username/medblockplus.git
cd medblockplus

# Install dependencies
npm install

# Add your Firebase credentials to .env
touch .env
# Add:
# FIREBASE_API_KEY=xxxx
# PINATA_API_KEY=xxxx

# Run the app
node index.js
Then open index.html in your browser. 🔥

🙈 Sensitive File Handling
Make sure to never commit:

.env

firebaseConfig.json

any private key

✅ They're listed in .gitignore.

📜 License
MIT License © 2025 [Shivansh Srivastava]

