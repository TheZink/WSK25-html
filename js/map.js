import { fetchData } from "./util.js";
import { putUser, getUser } from "./auth.js";

export const initializeMap = async (userCoords, restaurantsUrl, restaurantByIdUrl, dailyMenuUrl, modalElement, createModal, nearestElement) => {

    const blueIcon = L.divIcon({ className: 'blue-icon' }); // Restaurants location color
    const greenIcon = L.divIcon({ className: 'green-icon' }); // Selected restaurant color
    const redIcon = L.divIcon({ className: 'red-icon' }); // User location color

    let selectedMarker = null; // To track the currently selected marker

    // Function calculate distance between given coordinates in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };


    // Create the map
    const map = L.map('map').setView([userCoords.latitude, userCoords.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);


    // Add user location to the map
    const userLocation = L.marker([userCoords.latitude, userCoords.longitude]).addTo(map)
        .bindPopup('Olet täällä');
    userLocation.setIcon(redIcon);


    // Add restaurants to the map
    try {
        const restaurants = await fetchData(restaurantsUrl);
        restaurants.forEach(restaurant => {
            const coordinates = restaurant.location.coordinates;

            // Create a marker for each restaurant with information
            const restaurantLocation = L.marker([coordinates[1], coordinates[0]], { icon: blueIcon }).addTo(map)
                .bindPopup(`
                    <b>${restaurant.name}</b> 
                    <p class="popup-p">Osoite: ${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
                    <p class="popup-p">Puhelinnro: ${restaurant.phone}</p>
                    <p class="popup-p">Yhtiö: ${restaurant.company}</p>
                    <button id="${restaurant._id}">Ruokalista</button>
                    <button id="fav">Suosikki</button>
                `);

            // Handle marker click to change color
            restaurantLocation.on('click', () => {

                 // Reset previous marker
                if (selectedMarker) { selectedMarker.setIcon(blueIcon) };

                // Highlight selected marker
                restaurantLocation.setIcon(greenIcon); 
                
                // Update the selected marker
                selectedMarker = restaurantLocation;
            });
        });

        // Function sort nearest restaurants by users location
        const restaurantsDistance = restaurants.map(restaurant => {
            const [lon, lat] = restaurant.location.coordinates;
            const distance = calculateDistance(userCoords.latitude, userCoords.longitude, lat, lon);
            return {...restaurant, distance}
        });

        // Function pick 10 nearest restaurants from list
        const nearestRestaurants = restaurantsDistance
            .sort((a,b) => a.distance - b.distance)
            .slice(0,10);

        nearestElement.innerHTML = '';
        nearestRestaurants.forEach(restaurant => {
            nearestElement.innerHTML += `<p>${restaurant.name}, ${restaurant.address} ${restaurant.city}</p>`
        })
        
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
    }

    

    // Handle popup button click
    map.on('popupopen', async (e) => {
        const popupButton = e.popup._contentNode.querySelector('button');
        if (popupButton) {
            popupButton.addEventListener('click', async () => {
                const restData = await fetchData(restaurantByIdUrl(popupButton.id));
                const restMenu = await fetchData(dailyMenuUrl(popupButton.id));

                const { name, address, city, postalCode, phone, company } = restData;
                const { courses } = restMenu;

                // Initialize modal window
                modalElement.innerHTML = "";
                const restModal = createModal(name, address, city, postalCode, phone, company, courses);
                modalElement.appendChild(restModal);
                modalElement.style.display = "block";

                const closeModal = modalElement.querySelector(".close");
                closeModal.addEventListener('click', () => {
                    modalElement.style.display = "none";
                });
            });
        };

        // Save favourite restaurant to the sessionstorage, when button is pressed
        const favouriteButton = e.popup._contentNode.querySelector('button#fav');
        
        if (favouriteButton){

            favouriteButton.addEventListener('click', async () => {
            const putData = { favouriteRestaurant: popupButton.id };
            const token = JSON.parse(sessionStorage.getItem('userToken'));

                if (token){
                    await putUser(token, putData);
                    sessionStorage.setItem('userData', JSON.stringify(await getUser(token))); //Update sessionStorage
                    alert("Ravintola lisätty suosikkeisiin")
                } else {
                    alert('Sinun pitää kirjautua sisään, jotta voit laittaa ravintolan suosikkeisiin.')
                }

            });
        };
    });

};