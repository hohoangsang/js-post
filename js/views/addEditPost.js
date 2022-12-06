import postApi from '../services/postApi'
import { initPostForm, toast, imageSource } from '../utils'

function removeUnNeededField(formValues) {
  const payload = {...formValues}

  if (formValues.imageSource === imageSource.PICSUM) {
    delete payload.image
  } else {
    delete payload.imageUrl
  }

  delete payload.imageSource
  
  //remove id field if is add mode
  if (!formValues.id) delete payload.id

  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

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
      try {
        const payload = removeUnNeededField(formValues)
        const formData = jsonToFormData(payload)

        if (postId) formData.set("id", postId)

        const postResult = postId
          ? await postApi.updateFormData(formData)
          : await postApi.postFormData(formData)

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
