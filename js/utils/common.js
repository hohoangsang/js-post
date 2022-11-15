export function setTextContent(parent, selector, content) {
  if (!parent) return

  const selection = parent.querySelector(selector)
  if (selection) selection.textContent = content
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector)
  if (field) field.value = value
} 

export function setBackgroundImg(parent, selector, imageUrl) {
  if (!parent) return;

  const selection = parent.querySelector(selector);

  if (selection) selection.style.backgroundImage = `url("${imageUrl}")`
}
