import dayjs from 'dayjs'
import postApi from '../services/postApi'
import { registerLightBox, setTextContent } from '../utils'

function renderPostDetail(data) {
  if (!data) return

  //Update thumbnail
  const thumbnailHero = document.getElementById('postHeroImage')

  if (thumbnailHero) {
    thumbnailHero.style.backgroundImage = `url(${
      data?.imageUrl || 'https://via.placeholder.com/1368x400?text=Thumbnail'
    })`

    thumbnailHero.addEventListener('error', () => {
      thumbnailHero.style.backgroundImage =
        "url('https://via.placeholder.com/1368x400?text=Thumbnail')"
    })
  }

  // Update post title, author, time span, post's description

  setTextContent(document, '#postDetailTitle', data.title)
  setTextContent(document, '#postDetailAuthor', data.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    `- ${dayjs(data.updatedAt).format('hh:mm DD/MM/YYYY')}`
  )
  setTextContent(document, '#postDetailDescription', data.description)

  const editLink = document.getElementById("goToEditPageLink");
  if (editLink) {
    editLink.href= `/add-edit-post.html?id=${data.id}`
    editLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  } 
}

;(async () => {
  try {
    const url = new URL(window.location)

    const postId = url.searchParams.get('id')

    if (!postId) {
      console.log('post not found')
      return
    }

    const post = await postApi.getById(postId)

    renderPostDetail(post)

    registerLightBox({
      modalId: "lightbox",
      imgSelector: "[data-img=lightboxImg]",
      prevSelector: "[data-button=prevBtn]",
      nextSelector: "[data-button=nextBtn]"
    })
  } catch (error) {
    console.log('Failed to get post by id: ', error)
  }
})()
