// Funciones para crear capas
export function crearCapaBase(tipo, config) {
    return L.tileLayer(config.url, {
        attribution: config.attribution,
        minZoom: config.minZoom || 3,
        maxZoom: config.maxZoom || 30,
        zoomControl: config.zoomControl || true,
        fadeAnimation: config.fadeAnimation || true,
        zoomAnimation: config.zoomAnimation || true
    });
}

export function crearCapaGeoJSON(data, styleFn, popupFn) {
    return L.geoJSON(data, {
        style: styleFn,
        onEachFeature: popupFn
    });
}