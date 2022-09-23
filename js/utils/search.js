import debounce from 'lodash.debounce'

export function initSearch({elementId, defaultParams, onChange}) {
  const searchElement = document.getElementById(elementId)

  if (!searchElement) return

  // set default value of input search from query params
  if (defaultParams.get('title_like')) searchElement.value = defaultParams.get('title_like')

  const debounceSearch = debounce((event) => onChange(event.target.value), 800)

  searchElement.addEventListener('input', debounceSearch)
}
