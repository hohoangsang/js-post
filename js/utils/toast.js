import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const toast = {
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#4caf50',
      },
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#b71c1c',
      },
    }).showToast()
  },

  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#1e88e5',
      },
    }).showToast()
  },
}
