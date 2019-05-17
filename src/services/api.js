import axios from 'axios'
import { getJwt } from '../services/auth'

const api = axios.create({ baseURL: 'http://localhost:3001/api' })

api.interceptors.request.use(async config => {
    const token = getJwt();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  
export default api