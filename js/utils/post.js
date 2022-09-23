import dayjs from 'dayjs'
import { setTextContent } from './common'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  //reset current list post
  ulElement.textContent = ''

  postList.forEach((post, idx) => {
    const liElement = createPostItem(post)

    //register event redirect to post-detail page - start
    liElement.dataset.postId = post.id
    liElement.addEventListener("click", () => {
        const url = new URL(window.location);

        url.pathname = "/post-detail.html"
        url.search = ""
        url.searchParams.set("id", post.id)

        history.pushState({}, "", url);

        window.location.reload();
    })
    //register event redirect to post-detail page - end

    ulElement.appendChild(liElement)
  })
}

export function createPostItem(post) {
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
