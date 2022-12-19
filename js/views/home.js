import postApi from '../services/postApi'
import {
  baseLimit,
  basePage, initPagination,
  initSearch,
  renderPagination,
  renderPostList,
  toast
} from '../utils'

async function handleFilterChange(filterObj) {
  try {
    const url = new URL(window.location)

    if (filterObj && Object.keys(filterObj).length) {
      Object.keys(filterObj).forEach((filterName) =>
        url.searchParams.set(filterName, filterObj[filterName])
      )
    }

    history.pushState({}, '', url)

    //fetch API
    //re-reder posts list
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('fail to render post list', error)
  }
}

function registerPostRemove() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      const message = `Are you sure to remove post: "${post.title}"`

      if (window.confirm(message)) {
        await postApi.delete(post.id)

        handleFilterChange()
      } 
    } catch (error) {
     console.log("Failed to remove post ", error) 
     toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    //set default url
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', basePage)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', baseLimit)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementId: "pagination",
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange({_page: value}) 
    })

    initSearch({
      elementId: 'postSearch',
      defaultParams: queryParams,
      onChange: (value) =>
        handleFilterChange({
          title_like: value,
          _page: 1,
        }),
    })

    registerPostRemove()

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
    
  } catch (error) {
    console.log('get all failed', error)
  }
})()
