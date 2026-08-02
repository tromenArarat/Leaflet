var map = L.map('map').setView([-37.372246, -70.274423], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    zoomControl: true,
    fadeAnimation: true,
    zoomAnimation: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Capa base
var osm = L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    attribution: '<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 3,
    maxZoom: 30
}).addTo(map);

// Capa base satelital
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    minZoom: 3,
    maxZoom: 30
});

// CARGA DE CAPA BARRIOS
fetch('data/barrios.geojson')
  .then(response => response.json())
  .then(data => {

      const zonasLayer = L.geoJSON(data,{
        
        style: function(feature){
          return {
            color:'red',
          }
        },

        onEachFeature: function(feature, layer){
          if(feature.properties && feature.properties.nombre){
            layer.bindPopup(`<b>${feature.properties.nombre }</b>`)
          }
        }
      }).addTo(map)
      map.fitBounds(zonasLayer.getBounds())
  })
  .catch(error=> console.log(error))