import { urlRestaurantById } from '../js/baseUrl.js';
import { fetchData } from './util.js';

export const showUserData = (data, element) => {
    let restaurant = "";
    if(data.favouriteRestaurant) {
        restaurant = fetchData(urlRestaurantById(data.favouriteRestaurant))
    }

    element.innerHTML = `<h1 style="margin-top: 10px; margin-bottom: 30px; font-size: 50px;">Profiili</h1>
                    <p>Käyttäjänimi: ${data.username}</p>
                    <p>Sähköposti: ${data.email}</P>
                    <p>Suosikki ravintola ${restaurant.name || 'Ei ole määritetty'}
                    <img src=${data.avatar || ''}; style="margin-top: 10px;>
                    `
                    

};

export const postUserData = () => {
};