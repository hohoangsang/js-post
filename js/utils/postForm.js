import { randomNumber, setBackgroundImg, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'
import { imageSource } from './constance'

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  //custom message of input validation

  setFormValues(form, defaultValues)

  //init image source
  initImageSource(form)

  //init event
  initRandomImage(form)

  initUploadImage(form)

  initValidationOnchange(form)

  let isSubmiting = false

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (isSubmiting) return

    //disable submit button
    showLoading(form)
    isSubmiting = true

    //get form values
    const formValues = getFormValues(form)

    //validate form values
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    //enable submit button
    hideLoading(form)
    isSubmiting = false
  })
}

function initUploadImage(form) {
  const imageUpload = form.querySelector('[name="image"]')

  if (!imageUpload) return

  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setBackgroundImg(document, '#postHeroImage', imageURL)
    }

    validatePostField(
      form, 
      { imageSource: imageSource.UPLOAD, image: file }, 
      'image'
    )
  })
}

function initImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((inputRadio) => {
    inputRadio.addEventListener('change', (event) => {
      handleImageSourceControl(form, event.target.value)
    })
  })
}

function handleImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="image-source"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRandomImage(form) {
  const randomButton = form.querySelector('#postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    //Random number id of image
    //Set new URL Image
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    //Set background image
    setFieldValue(form, '[name="imageUrl"]', imageUrl) //hidden field
    setBackgroundImg(document, '#postHeroImage', imageUrl)
  })
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.innerHTML = `<i class="fas fa-save mr-1"></i> Saving`
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.innerHTML = `<i class="fas fa-save mr-1"></i> Save`
  }
}

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues.title)
  setFieldValue(form, '[name="author"]', formValues.author)
  setFieldValue(form, '[name="description"]', formValues.description)

  setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl) //hidden field
  setBackgroundImg(document, '#postHeroImage', formValues.imageUrl)
}

function getFormValues(form) {
  const formValues = {}

  //S1: query all field in form
  // ['title', 'author', 'description', 'imageUrl'].forEach(name => {
  //     const field = form.querySelector(`[name="${name}"]`)
  //     formValues[name] = field.value
  // })

  //S2: using FormData
  const formData = new FormData(form)

  for (const [key, value] of formData) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title!'),
    author: yup
      .string()
      .required('Please enter author!')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((word) => word.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select image source!')
      .oneOf([imageSource.UPLOAD, imageSource.PICSUM], 'Please enter valid image source!'),
    imageUrl: yup.string().when('imageSource', {
      is: imageSource.PICSUM,
      then: yup.string().required('Please enter image url!').url('Please enter valid url!'),
    }),
    image: yup.mixed().when('imageSource', {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please upload image!', (file) => Boolean(file.name))
        .test('max-sizes', 'Image too large(max 3mb)!', (file) => {
          const fileSize = file.size
          const MAX_SIZE = 3 * 1024 * 1024 //3mb
          // const MAX_SIZE = 3 * 1024//3kb
          return fileSize <= MAX_SIZE
        }),
    }),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset validate message
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

    //validate form values
    const postSchema = getPostSchema()
    await postSchema.validate(formValues, { abortEarly: false })
  } catch (error) {
    if (error.name === 'ValidationError' && Array.isArray(error.errors)) {
      const validationFlag = {}

      for (const validationError of error.inner) {
        const name = validationError.path
        const message = validationError.message

        if (validationFlag[name]) continue

        setFieldError(form, name, message)
        validationFlag[name] = true
      }
    }
  }

  //change class was-validated to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

async function validatePostField(form, formValues, name) {
  try {
    //reset field error
    setFieldError(form, name, '')
    const postSchema = getPostSchema()
    await postSchema.validateAt(name, formValues)
  } catch (error) {
    //set error message
    setFieldError(form, name, error.message)
  }

  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
}

function initValidationOnchange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    field.addEventListener('change', (event) => {
      const newValue = event.target.value
      validatePostField(form, { [name]: newValue }, name)
    })
  })
}
