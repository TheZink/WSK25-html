import { urlLoginUser } from "./baseUrl.js"
import { fetchData } from "./util.js"



export const logUserIn = async (username, password) => {
    const dataJson = {
        "username": username.toString(),
        "password": password.toString()
    }
    
    return await fetchData(urlLoginUser(dataJson));
}

export const createUser = async (username, password, email) => {
    const dataJson = {
        "username": username.toString(),
        "password": password.toString(),
        "email": email.toString()
    }
    
    return await fetchData(dataJson)
}

