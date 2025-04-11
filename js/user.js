import { urlCreateUser, urlLoginUser } from "./baseUrl.js"
import { fetchData, fetchDataOptions } from "./util.js"



export const logUserIn = async (username, password) => {

    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            username: username.toString(),
            password: password.toString()
        })
    };

    console.log("logUserIn activated");
    return await fetchDataOptions(urlLoginUser(), options);
}

export const createUser = async (username, password, email) => {

    const options = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            "username": username.toString(),
            "password": password.toString(),
            "email": email.toString()
        })
    };

    console.log('createUser activated');   
    return await fetchDataOptions(urlCreateUser(), options);
}

