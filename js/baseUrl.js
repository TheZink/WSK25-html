export const urlRestaurants = () => {
    return 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants'
}

export const urlMenu = (id) => {
    return `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/fi`
}

export const urlUser = (id, password) => {
    const dataJson = {
        "username": id,
        "password": password
    }
    return {
        url: 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login',
        data: dataJson
    };
}