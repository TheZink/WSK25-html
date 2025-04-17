import { urlUsers, urlLoginUser } from "./baseUrl.js"
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

export const postUser = async (username, password, email) => {
    
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        })
    };

    return await fetchDataOptions(urlUsers(), options);
}

export const putUser = async (token, updatedData) => {
    console.log('putUser token: ', token);
    console.log('putUser data: ', updatedData);

    const options = {
        method: 'PUT',
        headers: {Authorization: 'Bearer ' + token},
        body: JSON.stringify( updatedData )
    };

    return await fetchDataOptions(urlUsers(), options)
}

export const getUser = async (token) => {
    
    const options = {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token }
    };

    return await fetchDataOptions(urlUsers()+'/token', options)
};

export const deleteUser = async (token) => {

    const options = {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
    }

    return await fetchDataOptions(urlUsers(), options);
}
 

