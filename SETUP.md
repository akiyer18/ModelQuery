# Quick Setup Guide

## 🚀 Get Running in 3 Steps

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file with your API keys
echo "OPENAI_API_KEY=sk-proj-e-YMd..." > .env
echo "PINECONE_API_KEY=pcsk_4bZ5fo..." >> .env  
echo "PINECONE_INDEX_NAME=model-prompter" >> .env
echo "PORT=3001" >> .env

npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Open Browser
Visit `http://localhost:5173`

## 🔧 Your API Keys
Get these from your OpenAI and Pinecone accounts:
- **OpenAI**: `sk-proj-YOUR_OPENAI_API_KEY_HERE`
- **Pinecone**: `pcsk_YOUR_PINECONE_API_KEY_HERE`

## ✅ Test
Type "USB to RS232 converter" in the search box → should return results immediately!

## 🛠️ What I Fixed
- Changed `pinecone` → `@pinecone-database/pinecone` (correct npm package)
- Updated Pinecone API calls for newer SDK version
- Used exact same embeddings model (`text-embedding-3-large`) as your notebook 