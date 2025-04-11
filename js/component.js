export const restaurantModal = (name, address, city, postalCode, phone, company, courses) => {
  
    const modal = document.createElement('ul');
    let menuHtml = '';

    courses
    ? courses.forEach(course => {
        menuHtml += `<li>${course.name}, ${course.price || '?€'}. ${course.diets}</li>`;
    })
    : (menuHtml = 'Data retrieval fails');

     menuHtml += '</ul>';
     modal.innerHTML = `
        <span class="close">&times;</span>
        <h1>${name}</h1>
        <p>Company: ${company}</p>
        <p>Address: ${address}, ${city}</p>
        <p>PostalCode: ${postalCode}</p>
        <p>Phone: ${phone}</p>
        <h3> Courses</h3>
        ${menuHtml}
        `;

    return modal;
};