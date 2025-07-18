import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OpenAI } from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize OpenAI and Pinecone
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
})

const index = pc.index(process.env.PINECONE_INDEX_NAME || 'model-prompter')

// Text processing functions (same as notebook)
function normalizeText(text) {
  text = text.toLowerCase()
  text = text.replace(/\s+/g, ' ')              // Collapse multiple spaces
  text = text.replace(/\s([:;,.])/g, '$1')      // Remove space before punctuation
  return text.trim()
}

// Search endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    // Process query the same way as stored data (like notebook)
    const processedQuery = normalizeText(query)
    console.log(`🔍 Original: "${query}" → Processed: "${processedQuery}"`)

    // Generate embedding for the processed query
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: [processedQuery]
    })

    // Search Pinecone
    const searchResults = await index.query({
      vector: embedding.data[0].embedding,
      topK: 5,
      includeMetadata: true
    })

    // Log results for debugging (like notebook)
    console.log(`📊 Found ${searchResults.matches?.length || 0} matches:`)
    searchResults.matches?.forEach(match => {
      console.log(`  ✅ ${match.id} (${(match.score * 100).toFixed(1)}%)`)
    })

    res.json(searchResults)

  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Search failed' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/query`)
})

// Create a .env file with:
// OPENAI_API_KEY=your_openai_api_key_here
// PINECONE_API_KEY=your_pinecone_api_key_here
// PINECONE_INDEX_NAME=model-prompter
// PORT=3001 