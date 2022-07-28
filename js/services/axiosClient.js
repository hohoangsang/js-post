import Axios from 'axios'

const axiosClient = Axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosClient
