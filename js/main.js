import { urlAllRestaurants, urlRestaurantById, 
    urlDailyMenu} from "./baseUrl.js";
import { initializeMap } from "./map.js";
import { restaurantModal } from "./component.js";
import { logUserIn, createUser } from "./auth.js";

// Search.html element
const searchModal = document.getElementById('restaurantModal');
const mapContainer = document.getElementById('map');

// Login.html element
const loginForm = document.getElementById('loginForm');
const loginName = document.getElementById('loginName');
const loginPass = document.getElementById('loginPass');

// Register.html element
const createForm = document.getElementById('createForm');
const createName = document.getElementById('createName');
const createPass = document.getElementById('createPass');
const createEmail = document.getElementById('createEmail');

let userData = null;

const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
const favouriteRestData = JSON.parse(sessionStorage.getItem('favouriteRestData'));

// leaflet map
// Statement check, if "mapContainer" exist before initializing

mapContainer ? (() => {

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {

        const userCoords = pos.coords;
        console.log(userData);

        // Initialize the map with user location and restaurant data
        initializeMap(
            userCoords,
            urlAllRestaurants(),
            urlRestaurantById,
            urlDailyMenu,
            searchModal,
            restaurantModal
        );
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
})()
: null;


// User login
// Check if "login" element exist before adding event listener

loginForm ? (() => {
    
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userName = loginName.value;
        const password = loginPass.value;
        
        const fetchUser = await logUserIn(userName, password);
        
        // If login is succesfull, store login data and redirect user to the profile
        if (fetchUser) {
            sessionStorage.setItem('userData', JSON.stringify(fetchUser));
            window.location.href = 'profile.html';
            console.log('Login succesfull:', fetchUser);
        } else {
            console.log("Login failed")
        }    
    });
})() 
: null;

// User creation
// Check if "create" element exist before adding event listener

createForm ? (() => {
    
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = createName.value;
        const password = createPass.value;
        const email = createEmail.value;
        
        const postUser = await createUser(username,password,email);
        
        if (postUser) {
            sessionStorage.setItem('userData', JSON.stringify(postUser));
            console.log('Register succesfull: ', postUser);
        } else {
            console.log("Register failed")
        }
    })
})() 
: null;

// Restore userData from sessionstorage if not null
if (storedUserData != null) {
    console.log('Retrieved user data from sessionstorage:', storedUserData);
    userData = storedUserData; 
    console.log('userData is:', userData);

    // Add logout button and event listener, when user is logged in
    const headerElement = document.getElementById('header_a');
    if (headerElement) {
        const logout = document.createElement('a');
        logout.textContent = 'Kirjaudu ulos';

        logout.addEventListener('click', () => {
            sessionStorage.removeItem('userData');
            window.location.href = 'home.html';

            window.alert('Sinut kirjataan ulos ja ohjataan etusivulle');
        });

        headerElement.appendChild(logout);
    }

} else {
    console.log('No userdata in sessionstorage')
};

// Redirect user to login.html, if userData is null in profile.html
if (window.location.href.includes('profile.html') && storedUserData == null){
    window.location.href = 'login.html';
}

// TODO: Add function, that check if favouriteRestData exist
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};