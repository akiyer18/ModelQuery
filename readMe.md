# Device Model Finder

A simple, minimal web interface for finding electronic device models using natural language queries.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install

# Create .env file with your API keys:
# OPENAI_API_KEY=your_openai_api_key_here
# PINECONE_API_KEY=your_pinecone_api_key_here
# PINECONE_INDEX_NAME=model-prompter
# PORT=3001

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

## Usage

Type a device description like:
- "USB to RS232 converter"
- "ethernet to HART converter"
- "isolated RS485 interface"

Get instant results with:
- 🎯 **Best Match** - Top result with full description
- 🔍 **Similar Matches** - 4 related devices

## Features

- ⚡ Auto-search as you type (300ms debounce)
- 📱 Responsive design
- 🌙 Dark theme
- 🔄 Loading animations
- ⚠️ Error handling

Built with React + TailwindCSS + Express + Pinecone + OpenAI
