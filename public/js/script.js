
(() => {
  'use strict'

  
  const forms = document.querySelectorAll('.needs-validation') 

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// document.addEventListener("DOMContentLoaded", function() {
//     var map = L.map('map').setView([50.7, 4.7], 8);

//     L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=1f6851d004eb4467a5065065654f78fa', {
//         attribution: '© Geoapify | © OpenStreetMap contributors'
//     }).addTo(map);

//     fetch("https://api.geoapify.com/v1/routing?waypoints=50.96209827745463,4.414458883409225|50.429137079078345,5.00088081232559&mode=drive&apiKey=1f6851d004eb4467a5065065654f78fa")
//         .then(response => response.json())
//         .then(data => {
//             var coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
//             var route = L.polyline(coords, {color: 'blue', weight: 5}).addTo(map);
//             map.fitBounds(route.getBounds());
//             L.marker(coords[0]).addTo(map).bindPopup("Start").openPopup();
//             L.marker(coords[coords.length-1]).addTo(map).bindPopup("End");
//         })
//         .catch(error => console.error('Routing error:', error));
// });
