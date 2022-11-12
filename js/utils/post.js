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

    //register event redirect to post-detail page -- start
    liElement.dataset.postId = post.id
    liElement.addEventListener("click", (event) => {
      //S2: if event is triggered from menu --> ignore
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(event.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    })
    //register event redirect to post-detail page -- end

    // register event redirect to edit post page -- start
    const editBtn = liElement.querySelector('[data-id="edit"]')
    
    if (editBtn) {
      editBtn.addEventListener("click", (event) => {
        //S1: use stopPropagation() to ignore bubbling event
        // event.stopPropagation();
        window.location.assign(`/add-edit-post.html?id=${post.id}`)
      })
    }
    // register event redirect to edit post page -- end

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
