/**
 * Controles y leyendas del mapa
 */

let controlLeyenda = null;
let leyendaVisible = false;

// Configuración de colores por categoría para cada capa
const CONFIG_LEGENDAS = {
    'Alojamientos': {
        titulo: '🏨 Alojamientos',
        colores: {
            'Petfriendly': '#2ecc71',
            'No Petfriendly': '#3498db'
        },
        getConteo: function(geojson) {
            let pet = 0, noPet = 0;
            if (geojson && geojson.features) {
                geojson.features.forEach(f => {
                    if (f.properties.petfriendly) pet++;
                    else noPet++;
                });
            }
            return { pet, noPet };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #2ecc71;"></span>
                    <span class="categoria-label">Petfriendly 🐾</span>
                    <span class="categoria-count">${conteo.pet}</span>
                </div>
                <div class="categoria-item">
                    <span class="color-box" style="background: #3498db;"></span>
                    <span class="categoria-label">No Petfriendly</span>
                    <span class="categoria-count">${conteo.noPet}</span>
                </div>
            `;
        }
    },
    'Gastronomía': {
        titulo: '🍷 Gastronomía',

        /*
        '#E74C3C': 'red',
        '#E67E22': 'orange',
        '#F1C40F': 'yellow',
        '#7F8C8D': 'grey',
        '#3498DB': 'blue',
        '#C2185B': 'pink',
        '#A52714': 'red'
        */

        colores: {
        'restaurante': '#E74C3C',  // rojo
        'restobar': '#E67E22',     // naranja
        'rotiseria': '#F1C40F',    // amarillo
        'panaderia': '#F39C12',    // naranja
        'cerveceria': '#8E44AD',   // violeta
        'cafe_bar': '#2C3E50',     // azul oscuro
        'cafeteria': '#16A085',    // verde azulado
        'drugstore': '#7F8C8D',    // gris
        'comedor': '#D35400',      // naranja oscuro
        'pasteleria': '#FF6B9D',   // rosa
        'pizzeria': '#C0392B',     // rojo
        'heladeria': '#3498DB',    // azul
        'bar': '#3498DB',          // azul oscuro
        'parador': '#27AE60',      // verde
        'parrilla': '#A04000',     // naranja
        'discoteca': '#6C3483',
        'recuerdos': '#7F8C8D',    // violeta oscuro
        'otros': '#95A5A6'         // gris
    },
        getConteo: function(geojson) {
            const conteo = {};
            if (geojson && geojson.features) {
                geojson.features.forEach(f => {
                    const cat = f.properties.categoria || 'otros';
                    conteo[cat] = (conteo[cat] || 0) + 1;
                });
            }
            return conteo;
        },
        render: function(conteo, colores) {
            let html = '';
            const orden = ['bar',
                'cafe_bar',
                'cafeteria',
                'cerveceria',
                'comedor',
                'discoteca',
                'drugstore',
                'heladeria',
                'panaderia',
                'parador',
                'parrilla',
                'pasteleria',
                'pizzeria',
                'recuerdos',
                'restaurante',
                'restobar',
                'rotiseria',
                'otros'];
            orden.forEach(cat => {
                if (conteo[cat] > 0) {
                    const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ');
                    html += `
                        <div class="categoria-item">
                            <span class="color-box" style="background: ${colores[cat]};"></span>
                            <span class="categoria-label">${label}</span>
                            <span class="categoria-count">${conteo[cat]}</span>
                        </div>
                    `;
                }
            });
            return html;
        }
    },
    'Puntos Turísticos': {
        titulo: '🌄 Puntos turísticos',
        colores: { 'default': '#9C27B0' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #9C27B0;"></span>
                    <span class="categoria-count">${conteo.total} puntos de interés</span>
                </div>
            `;
        }
    },
    'Gomerías': {
        titulo: '🔧 Gomerías',
        colores: { 'default': '#FFEA00' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #FFEA00;"></span>
                    <span class="categoria-count">${conteo.total}</span>
                </div>
            `;
        }
    },
    'Recuerdos': {
        titulo: '🎁 Recuerdos',
        colores: { 'default': '#7F8C8D' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #7F8C8D;"></span>
                    <span class="categoria-label">Recuerdos y Artesanías</span>
                    <span class="categoria-count">${conteo.total}</span>
                </div>
            `;
        }
    },
    'Prestadores Turísticos': {
        titulo: '🥾 Prestadores turísticos',
        colores: { 'default': '#F57C00' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #F57C00;"></span>
                    <span class="categoria-label">Guías y Prestadores</span>
                    <span class="categoria-count">${conteo.total}</span>
                </div>
            `;
        }
    },
    'Guías de Pesca': {
        titulo: '🎣 Guías de pesca',
        colores: { 'default': '#A52714' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #A52714;"></span>
                    <span class="categoria-count">${conteo.total} guías de pesca deportiva</span>
                </div>
            `;
        }
    },
    'Supermercados': {
        titulo: '🛒 Supermercados y almacenes',
        colores: { 'default': '#777b7c' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #777b7c;"></span>
                    <span class="categoria-count">${conteo.total} establecimientos</span>
                </div>
            `;
        }
    },
    'Carnicerías': {
        titulo: '🥩 Carnicerías',
        colores: { 'default': '#795548' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #E74C3C;"></span>
                    <span class="categoria-count">${conteo.total} establecimientos</span>
                </div>
            `;
        }
    },
    'Farmacias': {
        titulo: '👩🏻‍🔬 Farmacias',
        colores: { 'default': '#097138' },
        getConteo: function(geojson) {
            return { total: geojson?.features?.length || 0 };
        },
        render: function(conteo) {
            return `
                <div class="categoria-item">
                    <span class="color-box" style="background: #097138;"></span>
                    <span class="categoria-count">${conteo.total}</span>
                </div>
            `;
        }
    }
};

function mostrarLeyenda(nombreCapa) {
    ocultarLeyenda();
    
    const config = CONFIG_LEGENDAS[nombreCapa];
    if (!config) {
        console.warn(`⚠️ No hay configuración de leyenda para: ${nombreCapa}`);
        return;
    }
    
    const nombreVar = nombreCapa.toLowerCase().replace(/ /g, '_');
    let geojson = window[`geojson_${nombreVar}`];
    
    if (!geojson && typeof capasCargadas !== 'undefined' && capasCargadas[nombreCapa]) {
        geojson = capasCargadas[nombreCapa];
    }
    
    if (!geojson || !geojson.features || geojson.features.length === 0) {
        console.warn(`⚠️ No hay datos para generar leyenda de: ${nombreCapa}`);
        return;
    }
    
    const conteo = config.getConteo(geojson);
    const contenidoItems = config.render(conteo, config.colores);
    const total = geojson.features.length;
    
    const leyendaHtml = `
        <div class="info-legend" id="leyenda-${nombreVar}">
            <h4>${config.titulo}</h4>
            ${contenidoItems}
            <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
        </div>
    `;
    
    controlLeyenda = L.control({ position: 'bottomleft' });
    controlLeyenda.onAdd = function() {
        const div = L.DomUtil.create('div', 'info-legend-container');
        div.innerHTML = leyendaHtml;
        return div;
    };
    controlLeyenda.addTo(getMapa());
    leyendaVisible = true;
}

function ocultarLeyenda() {
    if (controlLeyenda) {
        controlLeyenda.remove();
        controlLeyenda = null;
        leyendaVisible = false;
    }
}

function estaLeyendaVisible() {
    return leyendaVisible;
}

function actualizarLeyenda() {
    const capaActiva = getCapaActiva ? getCapaActiva() : null;
    if (capaActiva) {
        const capasOverlay = getCapasOverlay ? getCapasOverlay() : {};
        for (let nombre in capasOverlay) {
            if (capasOverlay[nombre] === capaActiva) {
                mostrarLeyenda(nombre);
                return;
            }
        }
    }
}