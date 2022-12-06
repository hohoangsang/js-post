import axiosClient from './axiosClient'

const postApi = {
  getAll(params) {
    const url = '/posts'
    return axiosClient.get(url, { params })
  },

  getById(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },

  update(data) {
    const url = `/posts/${data.id}`
    return axiosClient.patch(url, data)
  },

  post(data) {
    const url = '/posts'
    return axiosClient.post(url, data)
  },

  updateFormData(data) {
    const url = `/with-thumbnail/posts/${data.get("id")}`
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  postFormData(data) {
    const url = '/with-thumbnail/posts'
    return axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete(id) {
    const url = `/posts/${id}`
    return axiosClient.delete(url)
  },
}

export default postApi
