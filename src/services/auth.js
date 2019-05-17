import jwt_decode from 'jwt-decode'

export const getJwt = () => {
    return localStorage.getItem('token')
}

export const removeJwt = () => {
    return localStorage.removeItem('token')
}

export const loginOk = token => {
    localStorage.setItem('token', token)
}

export const getUser = () => {
    const token = getJwt()
    const user = jwt_decode(token) 
    return user   
}

export const isAuthenticated = () => localStorage.getItem('token') !==null
    

