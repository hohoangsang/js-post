function showModal(modalElement) {
  //make sure bootstrap was loaded
  if (!window.bootstrap) return

  const modal = new window.bootstrap.Modal(modalElement)

  modal.show()
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)

  if (!modalElement) return

  //selector
  const imgElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)

  if (!imgElement || !prevButton || !nextButton) return

  //modal vars
  let imgList = []
  let currentIndex = 0

  function showImgAtIndex(index) {
    if (index == null) return
    imgElement.src = imgList[index].src
  }

  function checkDisableButton() {
    if (currentIndex <= 0) prevButton.disabled = true
    else prevButton.disabled = false

    if (currentIndex >= imgList.length - 1) nextButton.disabled = true
    else nextButton.disabled = false
  }

  //event delegation
  document.addEventListener('click', (event) => {
    const { target } = event

    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)

    currentIndex = [...imgList].findIndex((x) => x === target)

    showImgAtIndex(currentIndex)

    showModal(modalElement)

    checkDisableButton()

    console.log({currentIndex})

    prevButton.addEventListener('click', () => {
      //handle click to show previour image
      currentIndex--;
      
      console.log(currentIndex)
      showImgAtIndex(currentIndex)
     
      checkDisableButton()
    })

    nextButton.addEventListener('click', () => {
      //handle click to show next image
      currentIndex++

      console.log(currentIndex)
      showImgAtIndex(currentIndex)

      checkDisableButton()
    })
  })
}
