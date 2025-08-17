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

// Remove debug logging in production

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      const delay = Math.pow(2, error.config.retryCount || 0) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      error.config.retryCount = (error.config.retryCount || 0) + 1
      if (error.config.retryCount <= 1) {
        return http.request(error.config)
      }
    }
    return Promise.reject(error)
  }
)