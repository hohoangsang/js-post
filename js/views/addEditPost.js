import postApi from '../services/postApi'
import { initPostForm, toast } from '../utils'
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

    const handleSubmitForm = async (formValues) => {
      // console.log('Data submit in parent', formValues)
      try {
        const postResult = postId
          ? await postApi.update({ ...formValues, id: postId })
          : await postApi.post(formValues)

        //show toast message
        toast.success('Save post successfully!')

        //redirect to detail post

        window.location.assign(`/post-detail.html?id=${postResult.id}`)
      } catch (error) {
        console.log('Failed to add/edit post: ', error)
        toast.error(`Error ${error}`)
      }
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
