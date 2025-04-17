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
                    <p>Suosikki ravintola: ${restaurant.name || 'Ei ole määritetty'}</p>
                    <p>&nbsp;</p>
                    <button id="updateB">Päivitä profiili</button>
                    <button id="deleteB">Poista profiili</button>
                    `
};

export const postUserData = (data, element) => {
    console.log("Menimme postUserData ja data on: ", data)
    element.innerHTML = `<h1 style="margin-top: 10px; margin-bottom: 30px; font-size: 50px;">Päivitä tietosi</h1>
                        <h3>Päivitä haluamasi tiedot. Jätä kentät tyhjäksi, jos et halua muuttaa niitä</h3>
                        <p>&nbsp;</p>

                        <p>Käyttäjätunnus</p>
                        <input id="userName" type="text" placeholder="${data.username}">
                        <p>&nbsp;</p>

                        <p>Salasana</p>
                        <input id="userPassword" type="password" placeholder="Syötä uusi salasana">
                        <p>&nbsp;</p>

                        <p>Sähköpostiosoite</p>
                        <input id="userEmail" type="emain" placeholder="${data.email}">
                        <p>&nbsp;</p>

                        <p>Profiilikuvan url-osoite</p>
                        <input id="userAvatar" type="text" placeholder="${data.avatar || "www.esimerkki.fi/kuva.jpg"}">
                        <p>&nbsp;</p>
                        `
};
