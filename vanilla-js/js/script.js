import { MAP_CONFIG, BASE_LAYERS } from './config.js';
import { getStyle, onEachFeature } from './estilos.js';
import { crearCapaBase, crearCapaGeoJSON } from './capas.js';

// Inicializar mapa
const map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

// Agregar capas base
const capaOSM = crearCapaBase('osm', BASE_LAYERS.osm).addTo(map);
const capaArgenmap = crearCapaBase('argenmap', BASE_LAYERS.argenmap).addTo(map);
const capaSatelital = crearCapaBase('satellite', BASE_LAYERS.satellite);

// Cargar datos GeoJSON
fetch('data/barrios.geojson')
    .then(response => response.json())
    .then(data => {
        const zonasLayer = crearCapaGeoJSON(data, getStyle, onEachFeature)
            .addTo(map);
        map.fitBounds(zonasLayer.getBounds());
    })
    .catch(error => console.error('Error cargando datos:', error));