import {removeAuth, setAuth} from "../api";

export const loginActions = (token) => {
    localStorage.setItem('user-token', token)
    setAuth(token)
}

export const logoutActions = () => {
    localStorage.removeItem('user-token')
    removeAuth()
    window.location.reload()
}