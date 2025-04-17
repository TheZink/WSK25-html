import { urlRestaurantById } from '../js/baseUrl.js';
import { fetchData } from './util.js';

export const restaurantModal = (name, address, city, postalCode, phone, company, courses) => {
  
    const modal = document.createElement('ul');
    let menuHtml = '';

    courses
    ? courses.forEach(course => {
        menuHtml += `<li style="list-style-type: none;">${course.name}, ${course.price || '?€'}. ${course.diets}</li>`;
        menuHtml += `<p>&nbsp;</p>`
    })
    : (menuHtml = 'Data retrieval fails');

     menuHtml += '</ul>';
     modal.innerHTML = `
        <span class="close">&times;</span>
        <h1>${name}</h1>
        <p>&nbsp;</p>
        <p>Yhtiö: ${company}</p>
        <p>Osoite: ${address}, ${city}</p>
        <p>Postinro: ${postalCode}</p>
        <p>Puhnro: ${phone}</p>
        <p>&nbsp;</p>
        <h3>Ateriat</h3>
        <p>&nbsp;</p>
        ${menuHtml}
        `;

    return modal;
};

export const showUserData = async (data, element) => {
    let restaurant = "";
    if(data.favouriteRestaurant) {
        restaurant = await fetchData(urlRestaurantById(data.favouriteRestaurant))
    }
    console.log('Profile restaurant', restaurant)
    element.innerHTML = `<h1 style="margin-top: 10px; margin-bottom: 30px; font-size: 50px;">Profiili</h1>
                    <p>Käyttäjänimi: ${data.username}</p>
                    <p>Sähköposti: ${data.email}</P>
                    <p>Suosikki ravintola: ${restaurant.name || 'Ei ole määritetty'}</p>
                    <p>&nbsp;</p>
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