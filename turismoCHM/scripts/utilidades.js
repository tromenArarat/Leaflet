/**
 * Utilidades generales para el mapa
 */

async function cargarGeoJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en cargarGeoJson:', error);
        return null;
    }
}

// Colores por categoría de gastronomía
const COLORES_GASTRONOMIA = {
    'bar': '#34495E',
    'cafe_bar': '#2C3E50',
    'cafeteria': '#16A085',
    'cerveceria': '#8E44AD',
    'comedor': '#D35400',
    'discoteca': '#6C3483',
    'drugstore': '#7F8C8D',
    'heladeria': '#3498DB',
    'panaderia': '#F39C12',
    'parador': '#27AE60',
    'parrilla': '#A04000',
    'pasteleria': '#FF6B9D',
    'pizzeria': '#C0392B',
    'restaurante': '#E74C3C',
    'restobar': '#E67E22',
    'rotiseria': '#F1C40F',
    'otros': '#95A5A6'
};

function getIconoAlojamiento(petfriendly) {
    const iconUrl = petfriendly 
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
    
    return L.icon({
        iconUrl: iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

function getIconoColor(color, shadow = true) {
    // Mapeo de colores a URLs de marcadores funcionales
    const colorMap = {
        '#E74C3C': 'red',
        '#E67E22': 'orange', 
        '#F1C40F': 'yellow',
        '#F39C12': 'orange',
        '#8E44AD': 'violet',
        '#2C3E50': 'blue',
        '#16A085': 'green',
        '#7F8C8D': 'grey',
        '#D35400': 'orange',
        '#FF6B9D': 'pink',
        '#C0392B': 'red',
        '#3498DB': 'blue',
        '#34495E': 'blue',
        '#27AE60': 'green',
        '#A04000': 'orange',
        '#6C3483': 'violet',
        '#95A5A6': 'grey',
        '#9C27B0': 'violet',
        '#FFEA00': 'yellow',
        '#C2185B': 'pink',
        '#F57C00': 'orange',
        '#A52714': 'red',
        '#424242': 'grey',
        '#795548': 'brown',
        '#097138': 'green',
        '#2ecc71': 'green'
    };
    
    const markerColor = colorMap[color] || 'blue';
    
    // URLs alternativas para marcadores de colores que FUNCIONAN
    // Opción 1: Usar CDN de leaflet-color-markers (más confiable)
    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`;
    // Opción 2 (fallback): Usar raw.githubusercontent
    // const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`;
    
    return L.icon({
        iconUrl: iconUrl,
        shadowUrl: shadow ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png' : '',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

function crearPopupAlojamiento(feature) {
    const props = feature.properties;
    let html = `<div class="popup-content">`;
    html += `<h3>${props.nombre || 'Sin nombre'}</h3>`;
    
    if (props.direccion) {
        html += `<div class="popup-detail"><strong>📌</strong><span class="value">${props.direccion}</span></div>`;
    }
    if (props.telefono) {
        html += `<div class="popup-detail"><strong>📞</strong><span class="value">${props.telefono}</span></div>`;
    }
    if (props.categoria) {
        html += `<div class="popup-detail"><strong>🏠</strong><span class="value">${props.categoria}</span></div>`;
    }
    if (props.petfriendly !== undefined && props.petfriendly !== null) {
        const badgeClass = props.petfriendly ? 'pet-badge' : 'no-pet-badge';
        const badgeText = props.petfriendly ? '🐾 Petfriendly' : '❌ No Petfriendly';
        html += `<div class="popup-detail"><span class="${badgeClass}">${badgeText}</span></div>`;
    }
    if (props.instagram) {
        html += `<div class="popup-detail"><strong>📷</strong><a href="${props.instagram}" target="_blank">Instagram</a></div>`;
    }
    if (props.facebook) {
        html += `<div class="popup-detail"><strong>📘</strong><a href="${props.facebook}" target="_blank">Facebook</a></div>`;
    }
    if (props.web) {
        html += `<div class="popup-detail"><strong>🌐</strong><a href="${props.web}" target="_blank">Sitio Web</a></div>`;
    }
    if (props.horarios) {
        html += `<div class="popup-detail"><strong>🕐</strong><span class="value">${props.horarios}</span></div>`;
    }
    if (props.descripcion && props.descripcion.length > 0 && !props.descripcion.includes('☏')) {
        html += `<div class="popup-detail" style="margin-top:6px;"><span class="value">${props.descripcion}</span></div>`;
    }
    html += `</div>`;
    return html;
}

function crearPopupGenerico(feature) {
    const props = feature.properties;
    let html = `<div class="popup-content">`;
    html += `<h3>${props.nombre || 'Sin nombre'}</h3>`;
    
    if (props.direccion) {
        html += `<div class="popup-detail"><strong>📌</strong><span class="value">${props.direccion}</span></div>`;
    }
    if (props.telefono) {
        html += `<div class="popup-detail"><strong>📞</strong><span class="value">${props.telefono}</span></div>`;
    }
    if (props.categoria) {
        const catLabel = props.categoria.charAt(0).toUpperCase() + props.categoria.slice(1).replace('_', ' ');
        html += `<div class="popup-detail"><strong>🏷️</strong><span class="value">${catLabel}</span></div>`;
    }
    if (props.instagram) {
        html += `<div class="popup-detail"><strong>📷</strong><a href="${props.instagram}" target="_blank">Instagram</a></div>`;
    }
    if (props.facebook) {
        html += `<div class="popup-detail"><strong>📘</strong><a href="${props.facebook}" target="_blank">Facebook</a></div>`;
    }
    if (props.web) {
        html += `<div class="popup-detail"><strong>🌐</strong><a href="${props.web}" target="_blank">Sitio Web</a></div>`;
    }
    if (props.horarios) {
        html += `<div class="popup-detail"><strong>🕐</strong><span class="value">${props.horarios}</span></div>`;
    }
    html += `</div>`;
    return html;
}

function sanitizarNombre(nombre) {
    return nombre.toLowerCase()
        .replace(/[áéíóú]/g, function(match) {
            const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
            return acentos[match] || match;
        })
        .replace(/[^a-z0-9]/g, '_');
}