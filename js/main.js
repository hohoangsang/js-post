import dayjs from 'dayjs'
import postApi from './services/postApi'
import { setTextContent } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'

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

  try {
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
  } catch (error) {
    console.log('Failed to create post item', error)
  }
}

;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 9,
    }
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
