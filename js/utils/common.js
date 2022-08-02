export function setTextContent(parent, selector, content) {
  if (!parent) return

  const selection = parent.querySelector(selector)
  if (selection) selection.textContent = content
}
