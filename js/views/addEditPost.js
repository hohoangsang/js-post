import postApi from '../services/postApi'
import { initPostForm } from '../utils'

;(async function () {
  try {
    const postDetailTitle = document.getElementById('postDetailTitle')

    const url = new URL(window.location)

    const postId = url.searchParams.get('id')

    postDetailTitle.innerText = postId ? 'Edit the post' : 'Add a post'

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          author: '',
          description: '',
          imageUrl: '',
          title: '',
        }

    const handleSubmitForm = (data) => {
      console.log(data)
    }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handleSubmitForm,
    })
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
