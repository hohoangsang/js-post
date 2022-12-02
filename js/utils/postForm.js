import { randomNumber, setBackgroundImg, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

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

  let isSubmiting = false

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (isSubmiting) return

    //disable submit button
    showLoading(form)
    isSubmiting = true

    //get form values
    const formValues = getFormValues(form)

    console.log(formValues)

    //validate form values
    const isValid = await validatePostForm(form, formValues)
    if (isValid) return await onSubmit?.(formValues)
    
    //enable submit button
    hideLoading(form)
    isSubmiting = false
  })
}

function initUploadImage(form) {
  const imageUpload = form.querySelector('[name="image"]')

  if (!imageUpload) return;

  imageUpload.addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setBackgroundImg(document, '#postHeroImage', imageURL)
    }
  })
}

function initImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach(inputRadio => {
    inputRadio.addEventListener("change", (event) => {
      handleImageSourceControl(form, event.target.value)
    })
  })
}

function handleImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="image-source"]');
  controlList.forEach(control => {
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
    imageUrl: yup.string().required('Please enter image url').url('Please enter valid url'),
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
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

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
