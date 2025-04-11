import { urlRestaurants, urlMenu, urlUser } from "./baseUrl.js";
import { fetchData } from "./util.js";

// leaflet map

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

function success(pos) {

    const blueIcon = L.divIcon({ className: 'blue-icon' }); // Restaurants location color
    const greenIcon = L.divIcon({ className: 'green-icon' }); // Selected restaurant color
    const redIcon = L.divIcon({ className: 'red-icon' }); // User location color

    let selectedMarker = null; // To track the currently selected marker


    const crd = pos.coords;
  
    // Create a map
    const map = L.map('map').setView([crd.latitude, crd.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

  
    // Add restaurants to the map
    fetchData(urlRestaurants())
    .then((restaurants) => {
        restaurants.forEach(restaurant => {
            const coordinates = restaurant.location.coordinates;

            // Create a marker with information
            const restaurantLocation = L.marker([coordinates[1], coordinates[0]]).addTo(map)
            .bindPopup(`<b>${restaurant.name}</b> 
                <p>${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
                <button id="${restaurant._id}">Ruokalista</button>`,)
            restaurantLocation.setIcon(blueIcon)
            
            // Eventlistener to change selected marker's icon to green
            restaurantLocation.on('click', () => {

                // Reset previously selected marker
                if (selectedMarker) { selectedMarker.setIcon(blueIcon);}

                // Change selected marker color
                restaurantLocation.setIcon(greenIcon);

                // Update the selected marker
                selectedMarker = restaurantLocation;
                
            })
        });
    })
    
    .catch((error) => {
        console.error('Error fetching restaurant data:', error);
    });

    // Add users location to the map
    const userLocation = L.marker([crd.latitude, crd.longitude]).addTo(map)
        .bindPopup('Olet täällä')
    userLocation.setIcon(redIcon)


    
    // Eventlistener for popup button
    map.on('popupopen', (e) => {
        const popupButton = e.popup._contentNode.querySelector('button');

        if (popupButton) {
            popupButton.addEventListener('click', () => {
                fetchData(urlMenu(popupButton.id))
                .then((restaurant) => {
                    console.log(restaurant.courses);
                })
            });
        }
    })



}
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);


