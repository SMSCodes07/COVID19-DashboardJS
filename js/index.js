window.onload = loadMap(); getCases(); getNews()
// Funcion para crear elementos en el DOM
function createDOMElements(itemToCreate) {
  const elementToCreate = document.createElement(itemToCreate);
  return elementToCreate;
}
// Funcion para crear elementos en el DOM
// Funcion para leer la cantidad de casos
async function getCases() {
  await firebase.database().ref('covid19Platform/cases/').once('value').then((userData) => {
    const listOfCases = Object.values(userData.val());
    let listOfPlaces = [];
    for (let index = 0; index < listOfCases.length; index++) {
      const element = listOfCases[index];
      console.log(element);
      const geoJsonCase = {
        type: 'Feature',
        properties: {
          description: '<img src=' + element.caseProfilePicture + ' class="casePicture"><strong>'+ element.caseName + ' ' + element.caseLastname +' </strong><ul class="detailsList"><li class="detailsItem"><p>' + element.caseDate + '</p></li><li class="detailsItem"><p>Número de caso:' + element.caseCode + '</p></li></ul>',
          icon: 'hospital'
        },
        geometry: {
          type: 'Point',
          coordinates: [element.caseLongitude, element.caseLatitude]
        }
      }
      listOfPlaces.push(geoJsonCase);
    }
    localStorage.setItem('geoList', JSON.stringify(listOfPlaces));
  });
}
// Funcion para leer la cantidad de casos
// Funcion para cargar el mapa en la ubicacion actual
function loadMap() {
    navigator.geolocation.getCurrentPosition((locationData) => {
        const longitude = locationData.coords.longitude;
        const latitude = locationData.coords.latitude;
        // Cargando mapa
        mapboxgl.accessToken = 'pk.eyJ1IjoibmctbGlkZWwiLCJhIjoiY2p6endxdGRyMG5mYjNicjZtNW83NDZjYiJ9.zzhI6lmKb6WsNufz-OWZcQ';
        var dashboardMap = new mapboxgl.Map({
            container: 'mapContainer',
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 15,
            center: [longitude, latitude]
        });
        // Cargando mapa
        const size = 100;
        const pulsingDot = {
          width: size,
          height: size,
          data: new Uint8Array(size * size * 4),
          onAdd: function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
          },
          render: function() {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;
          const radius = size / 2 * 0.3;
          const outerRadius = size / 2 * 0.7 * t + radius;
          const context = this.context;
          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(226, 45, 52,' + (1 - t) + ')';
          context.fill();
          // draw outer circle
          // draw inner circle
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(226, 45, 52, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();
          // draw inner circle
          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          // keep the map repainting
          dashboardMap.triggerRepaint();
          // return `true` to let the map know that the image was updated
          return true;
          }
        };
        dashboardMap.on('load', function() {
          dashboardMap.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
          dashboardMap.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                  }
                }]
              }
            },
            layout: {
              'icon-image': 'pulsing-dot'
            },
          });
        });
        dashboardMap.on('load', function() {
          dashboardMap.addSource('places', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: JSON.parse(localStorage.getItem('geoList'))
          }
          });
           
          // Add a layer showing the places.
          dashboardMap.addLayer({
          'id': 'places',
          'type': 'symbol',
          'source': 'places',
          'layout': {
          'icon-image': '{icon}-15',
          'icon-allow-overlap': true
          }
          });
           
          // Create a popup, but don't add it to the dashboardMap yet.
          var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
          });
          dashboardMap.on('mouseenter', 'places', function(e) {
          // Change the cursor style as a UI indicator.
          dashboardMap.getCanvas().style.cursor = 'pointer';
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;
          // Ensure that if the dashboardMap is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          // Populate the popup and set its coordinates
          // based on the feature found.
          popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(dashboardMap);
          });
           
          dashboardMap.on('mouseleave', 'places', function() {
          dashboardMap.getCanvas().style.cursor = '';
          popup.remove();
          });
        });
    });
}
// Funcion para cargar el mapa en la ubicacion actual
// Funcion para listar las noticias
async function getNews() {
  await firebase.database().ref('covid19Platform/news/').once('value').then((resultData) => {
      const newsList = Object.values(resultData.val());
      const listOfCols = document.getElementById('itemList');
      for (let index = 0; index < newsList.length; index++) {
          const element = newsList[index];
          console.log(element);
          // Creando elementos en el DOM
          // Creando columnas
          var appColumn = createDOMElements("div");
          appColumn.setAttribute("class", "col-10 col-sm-9 col-md-6 col-lg-5 col-xl-12");
          // Creando columnas
          // Creando tarjetas
          var appCard = createDOMElements("div");
          appCard.setAttribute("class", "card mb-4 shadow-sm border-0");
          // Creando tarjetas
          // Creando etiqueta
          const newsLabel = createDOMElements('label');
          newsLabel.setAttribute('class', 'cardImage3');
          // Creando etiqueta
          // Creando selector
          const fileChooser = createDOMElements('input');
          fileChooser.setAttribute('type', 'file');
          fileChooser.setAttribute('hidden', '');
          fileChooser.setAttribute('onchange', 'uploadFile(event, ' + element.newsCode + ')');
          // Creando selector
          // Creando imagenes
          var appImage = createDOMElements("img");
          appImage.setAttribute("class", "cardImage2");
          appImage.setAttribute("src", element.newsPicture);
          // Creando imagenes
          // Creando un cuerpo de tarjeta
          var appCardBody = createDOMElements("div");
          appCardBody.setAttribute("class", "card-body");
          // Creando un cuerpo de tarjeta
          // Creando titulo para la tarjeta
          var appCardTitle = createDOMElements("h6");
          appCardTitle.setAttribute("class", "card-title");
          appCardTitle.innerText = element.newsTitle;
          // Creando titulo para la tarjeta
          // Creando listado de informaciones
          var pTag1 = createDOMElements("p");
          pTag1.setAttribute("class", "p-0 m-0");
          pTag1.innerText = element.newsDescription;
          // Creando listado de informaciones
          // Creando contenedor para los botones
          var buttonContainer = createDOMElements("div");
          buttonContainer.setAttribute("class", "d-flex justify-content-between align-items-center mt-3");
          // Creando contenedor para los botones
          // Creando grupo para los botones
          var buttonGroup = createDOMElements("div");
          buttonGroup.setAttribute("class", "btn-group");
          // Creando grupo para los botones
          // Creando los botones
          var cardButton1 = document.createElement("button");
          cardButton1.innerText = "Editar";
          cardButton1.setAttribute("class", "btn btn-sm btn-outline-secondary");
          cardButton1.setAttribute("onclick", "saveData("+ element.newsCode +")");
          var cardButton2 = createDOMElements("button");
          cardButton2.innerText = "Eliminar";
          cardButton2.setAttribute("class", "btn btn-sm btn-outline-secondary");
          cardButton2.setAttribute("onclick", "deleteNews("+ element.newsCode +")");
          // Creando los botones
          // Creando fecha de registro
          var registerDate = createDOMElements("small");
          registerDate.setAttribute("class", "text-muted");
          registerDate.innerText = element.newsDate;
          // Creando fecha de registro
          // Creando los appendChilds
          appCard.appendChild(newsLabel);
          newsLabel.appendChild(appImage);
          newsLabel.appendChild(fileChooser);
          appCard.appendChild(appCardBody);
          appCardBody.appendChild(appCardTitle);
          appCardBody.appendChild(pTag1);
          appCardBody.appendChild(buttonContainer);
          buttonContainer.appendChild(buttonGroup);
          buttonGroup.appendChild(cardButton1);
          buttonGroup.appendChild(cardButton2);
          buttonContainer.appendChild(registerDate);
          appColumn.appendChild(appCard);
          listOfCols.appendChild(appColumn)
          // Creando los appendChilds
          // Creando elementos en el DOM
      }
  });
}
// Funcion para listar las noticias