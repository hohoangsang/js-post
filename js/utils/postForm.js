import { setBackgroundImg, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  //custom message of input validation

  setFormValues(form, defaultValues)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    //get form values
    const formValues = getFormValues(form)

    //validate form values
    const isValid = await validatePostForm(form, formValues)
    if (!isValid) return
    
    //check Is onSubmit function passed into initPostForm function 
    onSubmit?.(formValues)
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
    ['title', 'author'].forEach(name => setFieldError(form, name, ''))

    //validate form values
    const postSchema = getPostSchema()
    await postSchema.validate(formValues, { abortEarly: false })
  } catch (error) {
    if (error.name === 'ValidationError' && Array.isArray(error.errors)) {
      const validationFlag = {}

      for (const validationError of error.inner) {
        const name = validationError.path
        const message = validationError.message

        if (validationFlag[name]) continue;

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
