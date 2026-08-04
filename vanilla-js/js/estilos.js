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

export function densityStyle(feature) {
    return {
        fillColor: getDensityColor(feature.properties.dens_pobl),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Funciones de interacción para densidad
export function highlightDensityFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    layer.bringToFront();
}

export function resetDensityHighlight(e) {
    // Referencia al layer para resetear el estilo
    var layer = e.target;
    // Estilo original almacenado en el layer
    if (layer._originalStyle) {
        layer.setStyle(layer._originalStyle);
    } else {
        // Si no tenemos el estilo original, usamos densityStyle
        layer.setStyle(densityStyle(layer.feature));
    }
}

export function zoomToDensityFeature(e) {
    if (window.map) {
        window.map.fitBounds(e.target.getBounds());
    }
}

// onEachFeature para densidad
export function onEachDensityFeature(feature, layer) {
    if (feature.properties && feature.properties.dens_pobl) {
        layer.bindPopup(`Densidad: <b>${feature.properties.dens_pobl}</b> hab/ha`);
    }
}
    
   