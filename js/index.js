window.onload = loadMap();

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
    });
}
// Funcion para cargar el mapa en la ubicacion actual