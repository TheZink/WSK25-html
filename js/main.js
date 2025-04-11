import { urlAllRestaurants, urlRestaurantById, 
    urlDailyMenu} from "./baseUrl.js";
import { initializeMap } from "./map.js";
import { restaurantModal } from "./component.js";
import { logUserIn, createUser } from "./user.js";

// Search.html element
const searchModal = document.getElementById('restaurantModal');
const mapContainer = document.getElementById('map');

// Login.html element
const loginForm = document.getElementById('form');
const loginName = document.getElementById('loginName');
const loginPass = document.getElementById('loginPass')

// Register.html element
const createForm = document.getElementById('createForm');
const createName = document.getElementById('createName');
const createPass = document.getElementById('createPass');
const createEmail = document.getElementById('createEmail')

let userData = null;

const storedUserData = JSON.parse(sessionStorage.getItem('userData'));

// leaflet map

// Statement check, if "mapContainer" exist before initializing
if (mapContainer) {
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

}

// Check if "login" element exist before adding event listener
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userName = loginName.value;
        const password = loginPass.value;

        fetchUser = await logUserIn(userName, password);

        if (fetchUser) {
            sessionStorage.setItem('userData', JSON.stringify(fetchUser));
            console.log(fetchUser);
        } else {
            console.log("Login failed")
        }

    });
}

// Check if "create" element exist before adding event listener
if(createForm) {
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = createName.value;
        const password = createPass.value;
        const email = createEmail.value;
        
        const postUser = createUser(username,password,email);

        if (postUser) {
            sessionStorage.setItem('userData', JSON.stringify(postUser));
            console.log(postUser);
        } else {
            console.log("Register failed")
        }

        console.log(postUser);
    })
}

if (storedUserData) {
    console.log('Retrieved user data:', storedUserData);
    userData = storedUserData; // Restore userData from localStorage
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


