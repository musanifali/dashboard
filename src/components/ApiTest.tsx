import { useEffect, useState } from 'react'
import { http } from '@/lib/http'

export function ApiTest() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Environment variables:')
        console.log('VITE_COINGECKO_API_BASE:', import.meta.env.VITE_COINGECKO_API_BASE)
        console.log('VITE_COINGECKO_API_KEY:', import.meta.env.VITE_COINGECKO_API_KEY ? 'Set' : 'Not set')
        
        const response = await http.get('/ping')
        console.log('Ping response:', response.data)
        setStatus('API is working!')
      } catch (error) {
        console.error('API test failed:', error)
        setStatus(`API failed: ${error}`)
      }
    }
    
    testApi()
  }, [])

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3>API Test Status:</h3>
      <p>{status}</p>
    </div>
  )
}