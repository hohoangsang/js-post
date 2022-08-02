import postApi from './services/postApi'
import { setTextContent } from './utils'

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

    //Update title, description, author and thumbnail for each post

    // const titleElement = liElement.querySelector('[data-id="title"]')
    // if (titleElement) titleElement.textContent = post.title

    // const descriptionElement = liElement.querySelector('[data-id="description"]')
    // if (descriptionElement) descriptionElement.textContent = post.description

    // const authorElement = liElement.querySelector('[data-id="author"]')
    // if (authorElement) authorElement.textContent = post.auhtor

    setTextContent(liElement, '[data-id="title"]', post.title)
    setTextContent(liElement, '[data-id="description"]', post.description)
    setTextContent(liElement, '[data-id="author"]', post.author)

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnailElement) thumbnailElement.src = post.imageUrl

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
