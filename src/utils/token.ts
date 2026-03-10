//token的键
  export const TOKEN_KEY = 'USER_TOKEN'

  export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || ''
  }

  export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)  
  }

  export const removeToken = () => {  
    localStorage.removeItem(TOKEN_KEY)
  }