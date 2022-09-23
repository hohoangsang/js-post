export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const prevLink = ulPagination.firstElementChild?.firstElementChild
  const nextLink = ulPagination.lastElementChild?.firstElementChild

  //defaultParams is used for handle number of pagination

  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()

      const page = Number.parseInt(ulPagination.dataset.page) || 1

      if (page > 1) onChange(page - 1)
    })
  }

  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()

      const page = Number.parseInt(ulPagination.dataset.page) || 1
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages)

      if (page < totalPages) onChange(page + 1)
    })
  }
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  const { _limit, _page, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.firstElementChild.classList.add('disable-link')
  else ulPagination.firstElementChild?.firstElementChild.classList.remove('disable-link')

  if (_page >= totalPages)
    ulPagination.lastElementChild?.firstElementChild.classList.add('disable-link')
  else ulPagination.lastElementChild?.firstElementChild.classList.remove('disable-link')
}
