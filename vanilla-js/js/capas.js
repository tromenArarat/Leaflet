import { getStyle, onEachFeature } from './estilos.js';

export function crearCapaBase(nombre, config) {
    return L.tileLayer(config.url, {
        attribution: config.attribution,
        minZoom: config.minZoom || 3,
        maxZoom: config.maxZoom || 30
    });
}

export function crearCapaGeoJSON(nombre, url, estilo) {
    return L.geoJSON(null, {
        style: estilo
    }).addTo(map); 
}

// Versión mejorada que carga el GeoJSON
export async function cargarCapaGeoJSON(url, estilo = getStyle, cadaFeature = onEachFeature) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return L.geoJSON(data, {
            style: estilo,
            onEachFeature: cadaFeature
        });
    } catch (error) {
        console.error('Error cargando GeoJSON:', error);
        return null;
    }
}