import dayjs from 'dayjs'
import postApi from './services/postApi'
import { baseLimit, basePage, getUlPaginationElement, setTextContent } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'

// to use fromNow func
dayjs.extend(relativeTime)

function renderPostList(postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  //reset current list post
  ulElement.textContent = ''

  postList.forEach((post, idx) => {
    const liElement = createPostItem(post)
    ulElement.appendChild(liElement)
  })
}

function createPostItem(post) {
  if (!post) return
  //Find and clone post item template
  const liElement = document
    .getElementById('postItemTemplate')
    .content.firstElementChild.cloneNode(true)
  if (!liElement) return

  //Update title, description, author, thumbnail, timespan for each post

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', post.description)
  setTextContent(liElement, '[data-id="author"]', post.author)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Thumbnail'
    })
  }

  setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`)

  return liElement
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('Prev click')

  const ulPagination = getUlPaginationElement()

  const page = Number.parseInt(ulPagination.dataset.page) || 1

  if (page > 1) handleFilterChange({ _page: page - 1 })
}

function handleNextClick(e) {
  e.preventDefault()
  console.log('Next click')

  const ulPagination = getUlPaginationElement()

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages)

  if (page < totalPages) handleFilterChange({ _page: page + 1 })
}

async function handleFilterChange(filterObj) {
  if (!filterObj) return

  try {
    const url = new URL(window.location)

    Object.keys(filterObj).forEach((filterName) =>
      url.searchParams.set(filterName, filterObj[filterName])
    )

    history.pushState({}, '', url)

    //fetch API
    //re-reder posts list
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('fail to render post list', error)
  }
}

function renderPagination(pagination) {
  const ulPagination = getUlPaginationElement()
  if (!pagination || !ulPagination) return

  const { _limit, _page, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.firstElementChild.classList.add('disable-link')
  else ulPagination.firstElementChild?.firstElementChild.classList.remove('disable-link')

  if (_page >= totalPages)
    ulPagination.lastElementChild?.firstElementChild.classList.add('disable-link')
  else ulPagination.lastElementChild?.firstElementChild.classList.remove('disable-link')
}

function initPagination() {
  const ulPagination = getUlPaginationElement()
  if (!ulPagination) return

  const prevLink = ulPagination.firstElementChild?.firstElementChild
  const nextLink = ulPagination.lastElementChild?.firstElementChild

  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initSearch() {
  const searchElement = document.getElementById('postSearch')

  if (!searchElement) return

  // set default value of input search from query params
  const searchParams = new URLSearchParams(window.location.search)

  if (searchParams.get('title_like')) searchElement.value = searchParams.get('title_like')

  const debounceSearch = debounce((event) => {
    handleFilterChange({
      title_like: event.target.value,
      _page: 1,
    })
  }, 800)

  searchElement.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    //set default url
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', basePage)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', baseLimit)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination()
    initSearch()

    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
