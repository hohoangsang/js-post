import axiosClient from './services/axiosClient'
import postApi from './services/postApi'

async function main() {
  const queryParams = {
    _page: 1,
    _limit: 10,
  }
  const res = await postApi.getAll(queryParams)
}

main()
