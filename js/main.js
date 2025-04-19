import { urlAllRestaurants, urlRestaurantById, 
    urlDailyMenu} from "./baseUrl.js";
import { initializeMap } from "./map.js";
import { restaurantModal, postUserData, showUserData, homeMenuWeekly, homeMenuDaily } from "./component.js";
import { logUserIn, putUser, postUser, getUser, deleteUser} from "./auth.js";

// Home.html element
const homeFavourite = document.getElementById('favouriteRestaurant')
const headerElement = document.getElementById('header_a');
const dailyRadio = document.getElementById('daily');
const weeklyRadio = document.getElementById('weekly');


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

// Profile.html element
const profileContainer = document.getElementById('profile');
const profileUpdate = document.getElementById('profileUpdate');

let storedUserData = JSON.parse(sessionStorage.getItem('userData'));
let storedUserToken = JSON.parse(sessionStorage.getItem('userToken'));
let storedMenuType = JSON.parse(sessionStorage.getItem('menuType'));

// Home.html
// Check if "favouriteRestaurant" exist and user is logged in

homeFavourite && storedUserData != null ? (() => {

    
    if (storedMenuType === 'weekly') {
        homeMenuWeekly(storedUserData.favouriteRestaurant, homeFavourite);
    } else {
        homeMenuDaily(storedUserData.favouriteRestaurant, homeFavourite);
    } 

})()
: null;

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
        const passWord = loginPass.value;
        
        const fetchUser = await logUserIn(userName, passWord); // Fetch user login
        
        if (fetchUser) {
            const getData = await getUser(fetchUser.token); // Fetch users data

            sessionStorage.setItem('userToken', JSON.stringify(fetchUser.token)) // Store user token
            sessionStorage.setItem('userData', JSON.stringify(getData)); // Store user data

            window.location.href = 'profile.html';

        } else {
            alert("Väärä käyttäjätunnus tai salasana");
            console.log("Login failed")
        };    
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
        
        const createUser = await postUser(username,password,email);
        
        // If registration is successful, redirect user to login.html
        if (createUser) {
            alert("Rekisteröityminen onnistui! Nyt voit kirjautua sisään!")
            window.location.href = '/login.html';
        } else {
            alert("Rekisteröityminen epäonnistui. Syynä voi olla, että käyttäjänimi on varattu tai palvelussa on katko. Käytä toista käyttäjätunnusta tai yritä myöhemmin uudelleen.")
            console.log("Register failed")
        }
    })
})() 
: null;

// Profile
// Check if "profileContainer" exist before executing and adding event listeners

profileContainer ? (async () => {
    
    await showUserData(storedUserData, profileContainer);
    
    const updateButton = document.querySelector('#updateB');
    const deleteButton = document.querySelector('#deleteB');
    
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            window.location.href = '/profileupdate.html'
        });
    }
    
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const purgeUser = deleteUser(storedUserToken)
            if (purgeUser){
                sessionStorage.clear();
                alert('Käyttäjätunnukseksi poistettiin onnistuneesti')
                window.location.href = '/home.html';
            } else {
                alert('Virhe!');
            }
        })
    }
})()
:null;

// profileUpdate.html
// Check if "profileUpdate" exist before executing and adding event listeners
profileUpdate ? (() => {
    postUserData(storedUserData, profileUpdate);
    
    const postButton = document.getElementById('postButton');
    const abortButton = document.getElementById('abortButton');
    const userName = document.getElementById('userName');
    const userPassword = document.getElementById('userPassword')
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    let dataStore = {};
    
    postButton.addEventListener('click', async () => {
        userName.value ? dataStore.username = userName.value: null;
        userPassword.value ? dataStore.password = userPassword.value: null;
        userEmail.value ? dataStore.email = userEmail.value : null;
        userAvatar.value ? dataStore.avatar = userAvatar.value : null;
        
        // Check if dataStore has any properties
        if (Object.keys(dataStore).length > 0) {
            
            const putResult = await putUser(storedUserToken, dataStore);
            
            const getSession = await getUser(storedUserToken) //Fetch fresh userData
            sessionStorage.setItem('userData', JSON.stringify(getSession)); //Update sessionStorage
            
            if (putResult) {
                window.location.href = '/profile.html';
                alert('Tiedot päivitettiin onnistuneesti!');

            } else {
                alert('Tietojen päivittäminen epäonnistui. Yritäthän myöhemmin uudelleen.')
                
            }
        } else {
            alert('Et ole tehnyt muutoksia. Jos haluat päivittää tietojasi, täytä kentät. Muussa tapauksessa valitse "Peruuta" palataksesi takaisin.');
        }
        

    });

    abortButton.addEventListener('click', (evt) => {
        window.location.href = '/profile.html'
        alert('Palataan takaisin profiilin sivulle. Tietoja ei muutettu.')
    })

})()
:null;

// Restore userData from sessionstorage if not null
if (storedUserData != null && storedUserToken != null) {
    console.log('Retrieved user data from sessionstorage:', storedUserData);

    // Add logout and profile buttons, when user is logged in. Add also event listener
    if (headerElement) {
        const logout = document.createElement('a');
        logout.textContent = 'Kirjaudu ulos';

        const profile = document.createElement('a');
        profile.textContent = 'Profiili';
        profile.href = 'profile.html';

        logout.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'home.html';

            window.alert('Sinut kirjataan ulos ja ohjataan etusivulle');
        });

        headerElement.appendChild(profile);
        headerElement.appendChild(logout);
    }

} else {
    if (headerElement) {
        const login = document.createElement('a');
        login.textContent = 'Kirjaudu sisään';
        login.href = 'login.html';
        headerElement.appendChild(login);
    }
}

function handlePageChange() {
    console.log('Sivu vaihtui');

    // Redirect for unauthenticated users accessing profile.html
    if (window.location.href.includes('profile.html') && storedUserData == null){
        window.location.href = 'login.html';
    }
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

document.addEventListener('DOMContentLoaded', handlePageChange);