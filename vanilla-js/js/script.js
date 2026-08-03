import { MAP_CONFIG, BASE_LAYERS } from './config.js';
import { getStyle, onEachFeature } from './estilos.js';
import { crearCapaBase, crearCapaGeoJSON } from './capas.js';
import {mostrarCargando,ocultarCargando, cargarGeoJSON, verificarLayer } from './lazyLoad.js';

// Inicializar mapa
const map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

// Agregar capas base
const capaOSM = crearCapaBase('osm', BASE_LAYERS.osm).addTo(map);
const capaArgenmap = crearCapaBase('argenmap', BASE_LAYERS.argenmap).addTo(map);
const capaSatelital = crearCapaBase('satellite', BASE_LAYERS.satellite);

// Capas vacías como placeholders
const barriosLayer = L.geoJSON(null);

// Capas base y capas de superposición
const baseMap = {
    'OSM': capaOSM,  
    'Satelite': capaSatelital  
};

const overlayMap = {
    "Ordenamiento territorial": {
        "Barrios": barriosLayer
    }
};

// Controlador de capas
var controlLayer = L.control.groupedLayers(baseMap, overlayMap, {
    exclusiveGroups: ["Ordenamiento territorial"],
    groupCheckboxes: true
}).addTo(map);

// Carga capas sobrepuestas con flojera
map.on('overlayadd', function(e) {
    const nombreCapa = e.name;
    if (nombreCapa == 'Barrios') {
        verificarLayer(
            barriosLayer, 
            getStyle, 
            './data/barrios.geojson', 
            [
                { "titulo": "Titulo", "propiedad": "nombre" }
            ]
        );
    }
});