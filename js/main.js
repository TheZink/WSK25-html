import { urlRestaurants, urlMenu, urlUser } from "./baseUrl.js";
import { fetchData } from "./util.js";

// leaflet map

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

function success(pos) {
    const crd = pos.coords;
  
    const map = L.map('map').setView([60.192059, 24.945831], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

  
    // Add restaurants to the map
    fetchData(urlRestaurants())
    .then((restaurants) => {
        restaurants.forEach(restaurant => {
            const coordinates = restaurant.location.coordinates;
            
            L.marker([coordinates[1], coordinates[0]]).addTo(map)
            .bindPopup(`<b>${restaurant.name}</b> <p>${restaurant.address},${restaurant.city}</p>`,)
        });
    })
    
    .catch((error) => {
        console.error('Error fetching restaurant data:', error);
    });

    L.marker([crd.latitude, crd.longitude]).addTo(map)
    .bindPopup('You are here')
    .openPopup();
}
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);


