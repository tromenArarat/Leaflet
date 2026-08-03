// Configuración del mapa
export const MAP_CONFIG = {
    center: [-37.372246, -70.274423],
    zoom: 13,
    zoomControl: true,
    fadeAnimation: true,
    zoomAnimation: true
};

// Configuración de capas base
export const BASE_LAYERS = {
    osm: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    argenmap: {
        url: 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
        attribution: '<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a>',
        minZoom: 3,
        maxZoom: 30
    },
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        minZoom: 3,
        maxZoom: 30
    }
};

export const OVERLAY_LAYERS = {


}