import axiosClient from './services/axiosClient'
import postApi from './services/postApi'

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 10,
    }
    const res = await postApi.getAll(queryParams)
    console.log(res)
  } catch (error) {
    console.log('get all failed', error)
  }

  console.log(123)
}

main()
