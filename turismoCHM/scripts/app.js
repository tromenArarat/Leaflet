/**
 * Aplicación principal - Inicialización y carga de datos
 */

const URLS = {
    alojamientos: 'turismoCHM/data/alojamientos.geojson',
    gastronomia: 'turismoCHM/data/gastronomia.geojson',
    puntos_turisticos: 'turismoCHM/data/puntos_turisticos.geojson',
    gomerias: 'turismoCHM/data/gomerias.geojson',
    recuerdos: 'turismoCHM/data/recuerdos.geojson',
    prestadores: 'turismoCHM/data/prestadores.geojson',
    guias_pesca: 'turismoCHM/data/guias_pesca.geojson',
    supermercados: 'turismoCHM/data/supermercados.geojson',
    carnicerias: 'turismoCHM/data/carnicerias.geojson',
    farmacias: 'turismoCHM/data/farmacias.geojson'
};

const CONFIG_CAPAS = {
    'Alojamientos': {
        archivo: 'alojamientos',
        crearPopup: crearPopupAlojamiento,
        getIcono: function(feature) {
            return getIconoAlojamiento(feature.properties.petfriendly || false);
        }
    },
     'Carnicerías': {
        archivo: 'carnicerias',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#E74C3C'); }
    },
    'Farmacias': {
        archivo: 'farmacias',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#097138'); }
    },
    'Gastronomía': {
    archivo: 'gastronomia',
    crearPopup: crearPopupGenerico,
    getIcono: function(feature) {
        const color = COLORES_GASTRONOMIA[feature.properties.categoria] || '#95A5A6';
        return getIconoColor(color);
    }
},
    'Guías de Pesca': {
        archivo: 'guias_pesca',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#A52714'); }
    },
     'Gomerías': {
        archivo: 'gomerias',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#FFEA00'); }
    },
    'Puntos Turísticos': {
        archivo: 'puntos_turisticos',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#9C27B0'); }
    },
    'Prestadores Turísticos': {
        archivo: 'prestadores',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#F57C00'); }
    },
     'Recuerdos': {
        archivo: 'recuerdos',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#7F8C8D'); }
    },
    'Supermercados': {
        archivo: 'supermercados',
        crearPopup: crearPopupGenerico,
        getIcono: function() { return getIconoColor('#424242'); }
    }
};

let capasOverlay = {};
let capasCargadas = {};

document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

async function inicializarApp() {
    try {
        // 1. Inicializar el mapa
        inicializarMapa();
        
        // 2. Cargar todas las capas
        await cargarTodasLasCapas();
        
        // 3. Crear el control personalizado
        crearControlCapasPersonalizado();
        
        console.log('✅ Aplicación inicializada correctamente');
        console.log('📊 Capas disponibles:', Object.keys(capasOverlay).length);
        
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
    }
}

async function cargarTodasLasCapas() {
    const promesas = [];
    for (const [nombre, config] of Object.entries(CONFIG_CAPAS)) {
        promesas.push(cargarCapa(nombre, config));
    }
    await Promise.all(promesas);
}

async function cargarCapa(nombre, config) {
    try {
        const url = URLS[config.archivo];
        const datos = await cargarGeoJson(url);
        
        if (!datos || !datos.features || datos.features.length === 0) {
            console.warn(`⚠️ No hay datos para: ${nombre}`);
            return;
        }
        
        // Guardar referencia al GeoJSON para la leyenda
        const nombreVar = nombre.toLowerCase().replace(/ /g, '_');
        window[`geojson_${nombreVar}`] = datos;
        
        const capa = L.geoJSON(datos, {
            pointToLayer: function(feature, latlng) {
                const icono = config.getIcono(feature);
                return L.marker(latlng, { icon: icono });
            },
            onEachFeature: function(feature, layer) {
                const popupContent = config.crearPopup(feature);
                layer.bindPopup(popupContent, {
                    className: 'custom-popup',
                    maxWidth: 320
                });
            }
        });
        
        capasOverlay[nombre] = capa;
        capasCargadas[nombre] = datos;
        
        console.log(`✅ ${nombre} cargados: ${datos.features.length} elementos`);
        
    } catch (error) {
        console.error(`❌ Error al cargar ${nombre}:`, error);
    }
}

function getCapaPorNombre(nombre) {
    return capasOverlay[nombre] || null;
}