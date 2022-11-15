import { setBackgroundImg, setFieldValue, setTextContent } from './common'

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  //custom message of input validation

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    //get form values
    const formValues = getFormValues(form)

    console.log(formValues)

    //validate form values
    if (!validatePostForm(form, formValues)) return
    //if valid call onSubmit function
    //if not valid --> re-typing form
  })
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

function validatePostForm(form, formValues) {
  //create errors
  const errors = {
    title: getTitleError(form),
    // author: getAuthorError(form),
    //...
  }

  //set errors
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)
    element.setCustomValidity(errors[key])
    setTextContent(element.parentElement, '.invalid-feedback', errors[key])
  }

  //change class was-validated to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function getTitleError(form) {
  const title = form.querySelector('[name="title"]')

  //check required
  const isMissing = title.validity.valueMissing
  if (isMissing) return 'Please enter title!'

  //check at least two words with more than 3 characters
  const isMatchLenght = Boolean(
    title.value.split(' ').filter((word) => word.length >= 3).length >= 2
  )
  if (!isMatchLenght) return 'Title must have at least 2 words with more then 3 characters!'

  return ''
}