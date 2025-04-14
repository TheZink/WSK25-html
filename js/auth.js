import { urlUser, urlLoginUser } from "./baseUrl.js"
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

    return await fetchDataOptions(urlUser(), options);
}

export const putUser = async (token, updatedData) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer: ${token}`
        },
        body: JSON.stringify({
            updatedData
        })
    };

    return await fetchDataOptions(urlUser, options)
}

// For future use. Require URL fix
// export const getUserData = async (token) => {
    
//     const options = {
//         headers: {
//             Authorization: 'Bearer ' + token
//         }
//     };
//     console.log('Auth getUserData', options)

//     return await fetchDataOptions(urlUserData, options)
// };
 

