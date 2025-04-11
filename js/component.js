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