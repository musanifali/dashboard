import axios from 'axios'

const baseURL = import.meta.env.VITE_COINGECKO_API_BASE || '/api'

export const http = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
http.interceptors.request.use(
  (config) => {
    console.log('Making request to:', (config.baseURL || '') + (config.url || ''), config.params)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data)
    return response
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.response?.data || error.message)
    
    if (error.response?.status === 429) {
      const delay = Math.pow(2, error.config.retryCount || 0) * 1000
      console.log(`Rate limited, retrying in ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
      error.config.retryCount = (error.config.retryCount || 0) + 1
      if (error.config.retryCount <= 2) {
        return http.request(error.config)
      }
    }
    return Promise.reject(error)
  }
)