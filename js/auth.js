import { urlCreateUser, urlLoginUser } from "./baseUrl.js"
import { fetchDataOptions } from "./util.js"



export const logUserIn = async (username, password) => {

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    };

    return await fetchDataOptions(urlLoginUser(), options);
}

export const createUser = async (username, password, email) => {
    
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        })
    };

    return await fetchDataOptions(urlCreateUser(), options);
}
 

