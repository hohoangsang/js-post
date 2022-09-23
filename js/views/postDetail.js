import dayjs from 'dayjs';
import postApi from '../services/postApi'

function renderPostDetail(data) {
    if (!data) return;

    //Update thumbnail
    const thumbnailHero = document.getElementById("postHeroImage");

    if (thumbnailHero) {
        thumbnailHero.style.backgroundImage = `url(${data?.imageUrl ||'https://via.placeholder.com/1368x400?text=Thumbnail'})`
    }

    //Update post title
    const postTitle = document.getElementById("postDetailTitle");
    if (postTitle) {
        postTitle.textContent = data.title
    }

    //Update author
    const author = document.getElementById("postDetailAuthor");
    if (author) {
        author.textContent = data.author 
    }

    //Update time span
    const timeSpan = document.getElementById("postDetailTimeSpan");
    if (timeSpan) {
        timeSpan.textContent = `- ${dayjs(data.updatedAt).format("hh:mm DD/MM/YYYY")}`
    }

    //Update post's description
    const description = document.getElementById("postDetailDescription");
    if (description) {
        description.textContent = data.description 
    }

    //Update post's image
    const postImage = document.querySelector(".post-image");
    if (postImage) {
        postImage.src = data.imageUrl || "https://via.placeholder.com/1368x400?text=Thumbnail";
    }
}

;(async () => {
  try {
    const url = new URL(window.location)

    const postId = url.searchParams.get('id')

    const res = await postApi.getById(postId)

    renderPostDetail(res)

  } catch (error) {
    console.log("Failed to get post by id: ", error)
  }
})()
