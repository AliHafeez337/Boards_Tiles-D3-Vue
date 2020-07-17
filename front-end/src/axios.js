import axios from 'axios'
import { store } from './store/store';

const apiURL = 'http://localhost:3000/api';

axios.defaults.baseURL = apiURL

axios.defaults.headers.common['Authorization'] = 'bearer ' + store.state.token

axios.interceptors.request.use(config => {
  console.log('Request Interceptor', config)
  return config
})

axios.interceptors.response.use(res => {
  console.log('Response Interceptor', res)
  if (res.data.token) {
    axios.defaults.headers.common['Authorization'] = 'bearer ' + res.data.token
  }
  return res
})

export default axios