import { MAP_CONFIG, BASE_LAYERS } from './config.js';
import { getStyle, onEachFeature, densityStyle, onEachDensityFeature } from './estilos.js';
import { crearCapaBase, crearCapaGeoJSON } from './capas.js';
import {mostrarCargando,ocultarCargando, cargarGeoJSON, verificarLayer } from './lazyLoad.js';

// Inicializar mapa
const map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

// Agregar capas base
const capaOSM = crearCapaBase('osm', BASE_LAYERS.osm).addTo(map);
const capaArgenmap = crearCapaBase('argenmap', BASE_LAYERS.argenmap).addTo(map);
const capaSatelital = crearCapaBase('satellite', BASE_LAYERS.satellite);

// Capas vacías como placeholders
const barriosLayer = L.geoJSON(null, {
    attribution: '<a href="https://www.estadisticaneuquen.gob.ar/#/inicio">Dirección Provincial de Estadística y Censos de Neuquén</a>',
    onEachFeature: onEachFeature 
});

const densidadLayer = L.geoJSON(null, {
    attribution: '<a href="https://censo.gob.ar/">Censo Nacional 2022</a>',
    onEachFeature: onEachDensityFeature
});

// Capas base y capas de superposición
const baseMap = {
    'OSM': capaOSM,  
    'Satelite': capaSatelital  
};

const overlayMap = {
    "<strong>Ordenamiento territorial</strong>": {
        "Barrios": barriosLayer,
        "Densidad (hab/ha)": densidadLayer
    }
};

// Controlador de capas
var controlLayer = L.control.groupedLayers(baseMap, overlayMap, {
    exclusiveGroups: ["<strong>Ordenamiento territorial</strong>"],
    groupCheckboxes: true
}).addTo(map);

// Carga capas sobrepuestas con flojera 
map.on('overlayadd', function(e) {
    const nombreCapa = e.name;
    
    if (nombreCapa == 'Barrios') {
        verificarLayer(
            barriosLayer, 
            getStyle, 
            './vanilla-js/data/barrios.geojson', 
            [
                { "titulo": "Titulo", "propiedad": "nombre" }
            ],
            onEachFeature  
        );
    }
    
    if (nombreCapa == 'Densidad (hab/ha)') {
        verificarLayer(
            densidadLayer, 
            densityStyle, 
            './vanilla-js/data/dne.geojson', 
            [
                { "titulo": "Densidad", "propiedad": "dens_pobl" }
            ],
            onEachDensityFeature  
        );
    }
});

