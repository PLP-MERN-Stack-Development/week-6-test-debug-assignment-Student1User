export const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateName = (name) => {
  return name && name.trim().length >= 2
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
