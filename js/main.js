import dayjs from 'dayjs'
import postApi from './services/postApi'
import { setTextContent } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'
import { baseLimit, basePage } from './utils/constance'

// to use fromNow func
dayjs.extend(relativeTime)

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

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
  e.preventDefault();
  console.log("Prev click")
}

function handleNextClick(e) {
  e.preventDefault();
  console.log("Next click")
}

function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url)

  //fetch API
  //re-reder posts list
}

function initPagination() {
  const ulPagination = document.getElementById("pagination");
  if (!ulPagination) return;

  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  const nextLink = ulPagination.lastElementChild?.firstElementChild;

  const url = new URL(window.location);

  if (prevLink) {
    if (Number(url.searchParams.get("_page")) === 1 || !url.searchParams.get("_page")) {
      return prevLink.classList.add("disable-link")
    }  
    return prevLink.addEventListener("click", handlePrevClick)
  }

  if (nextLink) {
    nextLink.addEventListener("click", handleNextClick)
  }
} 

function initURL() {
  const url = new URL(window.location);

  if (!url.searchParams.get("_page")) url.searchParams.set("_page", basePage);
  if (!url.searchParams.get("_limit")) url.searchParams.set("_limit", baseLimit);

  history.pushState({}, '', url)
}

;(async () => {
  try {
    initPagination();
    initURL();

    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
