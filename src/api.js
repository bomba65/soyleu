import axios from 'axios'
import store from './store'

export const baseURL = 'http://91.201.214.203/api/v1'

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    if (error.response.status === 401) {
      store.dispatch('userLogout')
      $router.push('/login')
    }
    return Promise.reject(error)
})

export const setAuth = token => { api.defaults.headers.common['Authorization'] = `Token ${token}` }
export const removeAuth = () => { delete api.defaults.headers.common['Authorization'] }

export default api