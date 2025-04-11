import { fetchData } from "./util.js";

export const initializeMap = async (userCoords, restaurantsUrl, restaurantByIdUrl, dailyMenuUrl, modalElement, createModal) => {
    const blueIcon = L.divIcon({ className: 'blue-icon' }); // Restaurants location color
    const greenIcon = L.divIcon({ className: 'green-icon' }); // Selected restaurant color
    const redIcon = L.divIcon({ className: 'red-icon' }); // User location color

    let selectedMarker = null; // To track the currently selected marker

    // Create the map
    const map = L.map('map').setView([userCoords.latitude, userCoords.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add user location to the map
    const userLocation = L.marker([userCoords.latitude, userCoords.longitude]).addTo(map)
        .bindPopup('Olet täällä');
    userLocation.setIcon(redIcon);

    // Fetch and add restaurants to the map
    try {
        const restaurants = await fetchData(restaurantsUrl);
        restaurants.forEach(restaurant => {
            const coordinates = restaurant.location.coordinates;

            // Create a marker for each restaurant
            const restaurantLocation = L.marker([coordinates[1], coordinates[0]], { icon: blueIcon }).addTo(map)
                .bindPopup(`
                    <b>${restaurant.name}</b> 
                    <p class="popup-p">Osoite: ${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}</p>
                    <p class="popup-p">Puhelinnro: ${restaurant.phone}</p>
                    <p class="popup-p">Yhtiö: ${restaurant.company}</p>
                    <button id="${restaurant._id}">Ruokalista</button>
                `);

            // Handle marker click to change color
            restaurantLocation.on('click', () => {
                if (selectedMarker) selectedMarker.setIcon(blueIcon); // Reset previous marker
                restaurantLocation.setIcon(greenIcon); // Highlight selected marker
                selectedMarker = restaurantLocation;
            });
        });
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
        }
    });
};