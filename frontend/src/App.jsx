import { useState, useEffect } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)

  const searchModels = async (searchQuery) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setResults(null)
      return
    }
    searchModels(query)
  }

  const parseModelSpecs = (text) => {
    if (!text) return {}
    
    const specs = {}
    const parts = text.split('.')
    
    parts.forEach(part => {
      const trimmed = part.trim()
      if (trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':')
        const key = trimmed.substring(0, colonIndex).trim()
        const value = trimmed.substring(colonIndex + 1).trim()
        
        if (key && value) {
          // Clean up the key for better display
          const cleanKey = key
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^\w/, c => c.toUpperCase())
          specs[cleanKey] = value
        }
      }
    })
    
    return specs
  }

  const openModelDetails = (match) => {
    setSelectedModel(match)
  }

  const closeModelDetails = () => {
    setSelectedModel(null)
  }

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModelDetails()
      }
    }

    if (selectedModel) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selectedModel])

  const bestMatch = results?.matches?.[0]
  const similarMatches = results?.matches?.slice(1, 5) || []

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Device Model Finder</h1>
          <p className="text-gray-400">Find electronic devices by description</p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., USB to RS232 converter, ethernet to HART converter..."
              className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
            Error: {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Best Match */}
            {bestMatch && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Best Match
                </h2>
                <div 
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => openModelDetails(bestMatch)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-blue-400 hover:text-blue-300">{bestMatch.id}</h3>
                    <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm">
                      {(bestMatch.score * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {bestMatch.metadata?.text || 'No description available'}
                  </p>
                  <div className="mt-3 text-sm text-blue-400">
                    Click to view detailed specifications →
                  </div>
                </div>
              </div>
            )}

            {/* Similar Matches */}
            {similarMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Similar Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarMatches.map((match) => (
                    <div 
                      key={match.id} 
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => openModelDetails(match)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-400 hover:text-blue-300">{match.id}</h4>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {(match.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {match.metadata?.text?.substring(0, 120)}...
                      </p>
                      <div className="mt-2 text-xs text-blue-400">
                        Click for details →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !query && (
          <div className="text-center text-gray-500 py-12">
            <p>Enter a device description and click Search to find matching models.</p>
          </div>
        )}

        {/* Model Details Modal */}
        {selectedModel && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModelDetails}
          >
            <div 
              className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-blue-400">{selectedModel.id}</h2>
                  <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm mt-2 inline-block">
                    {(selectedModel.score * 100).toFixed(1)}% match
                  </span>
                </div>
                <button 
                  onClick={closeModelDetails}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <h3 className="text-lg font-semibold mb-4 text-white">Device Specifications</h3>
                
                {/* Specifications Table */}
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="text-left p-3 text-gray-300 font-medium">Specification</th>
                        <th className="text-left p-3 text-gray-300 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(parseModelSpecs(selectedModel.metadata?.text || '')).map(([key, value], index) => (
                        <tr 
                          key={index} 
                          className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                        >
                          <td className="p-3 text-blue-400 font-medium">
                            {key}
                          </td>
                          <td className="p-3 text-gray-300">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Full Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-white">Full Description</h4>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selectedModel.metadata?.text || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 