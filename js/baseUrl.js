// Fetch all restaurants
export const urlAllRestaurants = () => {
    return 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants'
};

// Fetch restaurant by id
export const urlRestaurantById = (id) => {
    return `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/${id}`
};

// Fetch restaurant daily menu by id
export const urlDailyMenu = (id) => {
    return `https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/fi`
};

// Fetch user login
export const urlLoginUser = () => {
     return 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login'
}
 
// Create user
export const urlCreateUser = () => {
    return 'https://media2.edu.metropolia.fi/restaurant/api/v1/users'
};