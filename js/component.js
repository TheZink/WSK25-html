import { urlDailyMenu, urlRestaurantById, urlWeeklyMenu } from '../js/baseUrl.js';
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
                    <p>Käyttäjätaso: ${data.role}</p>
                    <p>Suosikki ravintola: ${restaurant.name || 'Ei ole määritetty'}</p>
                    <p>&nbsp;</p>
                    <img src='${data.avatar || "assets/nullPicture.png"}'
                    <p>&nbsp;</p>
                    `
};

export const postUserData = (data, element) => {
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

export const homeMenuWeekly = async (restaurantId, element) => {
    const getWeeklyMenu = await fetchData(urlWeeklyMenu(restaurantId))
    const getRestaurant = await fetchData(urlRestaurantById(restaurantId))

    const time = new Date();
    const formattedDate = new Intl.DateTimeFormat("fi-FI", {
        weekday: "long", // Day name
        day: "numeric", // Date number
        month: "long" // Month name
    }).format(time);

    let menuWeeklyHtml = '';

    getWeeklyMenu.days.forEach(day => {
        menuWeeklyHtml += `<p>&nbsp;</p>`;
        if (day.date === formattedDate)
            { menuWeeklyHtml += `<h3 style="color: red">${day.date}</h3>`; }
        else 
            { menuWeeklyHtml += `<h3>${day.date}</h3>`; }
        menuWeeklyHtml += `<p>&nbsp;</p>`;

        day.courses.forEach(courses => {
            menuWeeklyHtml += `<li style="list-style-type: none;">${courses.name}, ${courses.price || '?€'}. ${courses.diets}</li>`;
        });
    });
  
    element.innerHTML = `
                        <h2>Suosikki opiskelijaravintola</h2>
                        <p>&nbsp;</p>
                        <h3>${getRestaurant.name}</h3>
                        <p>${getRestaurant.address}, ${getRestaurant.city} ${getRestaurant.postalCode}
                        <p>${getRestaurant.phone}</p>
                        <p>&nbsp;</p>

                        <input type="radio" id="weekly" name="menu_type" value="HTML" checked>
                        <label for="html">Viikkolista</label><br>

                        <input type="radio" id="daily" name="menu_type" value="HTML">
                        <label for="html">Päivälista</label><br>
                        <p>&nbsp;</p>

                        <h3>Viikon ruokalista</h3>
                    
                        <p>Alla näet suosikkiravintolan päiväkohtaiset ruokalistat. Tämän päivänen lista on merkattu punaisella</p>
                       
                        ${menuWeeklyHtml}
                        `

    const dailyRadio = document.getElementById('daily');

    if(dailyRadio) {
        dailyRadio.addEventListener('change', () => {
            sessionStorage.setItem('menuType',JSON.stringify('daily'))
            homeMenuDaily(restaurantId,element);
        })
    } else {
        console.warn('dailyRadio element not found');
    };
}

export const homeMenuDaily = async (restaurantId, element) => {
    const getDailyMenu = await fetchData(urlDailyMenu(restaurantId))
    const getRestaurant = await fetchData(urlRestaurantById(restaurantId))

    const homeList = document.createElement('ul');
    let menuDailyHtml = '';

    getDailyMenu.courses.forEach(course => {
        menuDailyHtml += `<p>&nbsp;</p>`;
        menuDailyHtml += `<li style="list-style-type: none;">${course.name}, ${course.price || '?€'}. ${course.diets}</li>`;
        menuDailyHtml += `<p>&nbsp;</p>`
    });
  
    element.innerHTML = `
                        <h2>Suosikki opiskelijaravintola</h2>
                        <p>&nbsp;</p>
                        <h3>${getRestaurant.name}</h3>
                        <p>${getRestaurant.address}, ${getRestaurant.city} ${getRestaurant.postalCode}
                        <p>${getRestaurant.phone}</p>
                        <p>&nbsp;</p>

                        <p>Ruokalistan esitys</p>
                        <input type="radio" id="weekly" name="menu_type" value="HTML" >
                        <label for="html">Viikkolista</label><br>

                        <input type="radio" id="daily" name="menu_type" value="HTML" checked>
                        <label for="html">Päivälista</label><br>
                        <p>&nbsp;</p>

                        <h3>Päivän ruokalista</h3>
                    
                        <p>Alla näet suosikkiravintolan päiväkohtaisen ruokalistan.</p>
                        ${menuDailyHtml}
                        `
    const weeklyRadio = document.getElementById('weekly');

    if(weeklyRadio) {
        weeklyRadio.addEventListener('change', () => {
            sessionStorage.setItem('menuType',JSON.stringify('weekly'))
            homeMenuWeekly(restaurantId,element);
        })
    } else {
        console.warn('weeklyRadio element not found');
    }   
};
