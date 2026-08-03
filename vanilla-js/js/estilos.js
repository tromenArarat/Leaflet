// Funciones de estilo para los barrios
export function getColor(feature) {
    const colores = {
        "DON BOSCO": '#FF0000',
        "CHACRAS NORTE": '#0000FF',
        "LAS VERTIENTES": '#00CC00',
        "RUTA 40": '#FFA500',
        "URIBURU": '#800080',
        "CORDILLERA DEL VIENTO": '#FF69B4',
        "TIRO FEDERAL": '#00BFFF',
        "PARQUE LA HOYA": '#32CD32',
        "JARDIN": '#FFD700',
        "AREA CENTRO": '#8B4513',
        "AGUA ESCONDIDA": '#2F4F4F',
        "ÁREA DE FRONTERA": '#DC143C',
        "LAS FLORES": '#FFB6C1',
        "ALTOS DEL SOL": '#F0E68C',
        "IV DIVISIÓN": '#6A5ACD',
        "CANALITO": '#00CED1',
        "CENTENARIO I": '#DAA520',
        "CENTENARIO II": '#B8860B',
        "CHACRA SUR": '#CD853F'
    };
    return colores[feature.properties.nombre] || '#FFEDA0';
}

export function getStyle(feature) {
    return {
        fillColor: getColor(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

export function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.nombre) {
        layer.bindPopup(`<b>${feature.properties.nombre}</b>`);
    }
}

// Funciones de estilo para la densidad
export function getDensityColor(dens_pobl) {
    return dens_pobl > 85 ? '#800026' :
           dens_pobl > 65  ? '#BD0026' :
           dens_pobl > 45  ? '#E31A1C' :
           dens_pobl > 25  ? '#FC4E2A' :
           dens_pobl > 5   ? '#FD8D3C' :
           '#FFEDA0';
}

function densityStyle(feature) {
    return {
        fillColor: getDensityColor(feature.properties.dens_pobl),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightDensityFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    layer.bringToFront();
}

function resetDensityHighlight(e) {
    densityLayer.resetStyle(e.target);
}

function zoomToDensityFeature(e) {
    mimapa.fitBounds(e.target.getBounds());
}

function onEachDensityFeature(feature, layer) {
    layer.on({
        mouseover: highlightDensityFeature,
        mouseout: resetDensityHighlight,
        click: zoomToDensityFeature
    });
    
    // Agregar popup con información de densidad
    var props = feature.properties;
    layer.bindPopup(
        `Población total: ${props.p02_tot || 0}<br>
         Densidad: ${props.dens_pobl || 0} hab/ha`
    );
}