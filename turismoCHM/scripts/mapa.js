/**
 * Configuración del mapa y capas base
 */

let mapa;
let capasBase = {};
//let capasOverlay = {};
let controlCapasPersonalizado = null;
let capaActiva = null;

function inicializarMapa() {
    mapa = L.map('map', {
        center: [-37.380, -70.270],
        zoom: 14,
        zoomControl: true,
        fadeAnimation: true,
        zoomAnimation: true,
        attributionControl: false  // Desactivar atribución por defecto
    });

    configurarCapasBase();
    
    // Agregar atribución personalizada
    L.control.attribution({
        position: 'bottomright',
        prefix: 'Leaflet | <a href="https://chosmalal.gob.ar/" target="_blank">Municipalidad de Chos Malal</a>'
    }).addTo(mapa);
    
    L.control.scale({ 
        position: 'bottomright',
        metric: true,
        imperial: false
    }).addTo(mapa);
}

function configurarCapasBase() {
    // Solo OSM como capa base, sin mostrarla en el control
    capasBase['osm'] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',  // Atribución vacía, usamos la personalizada
        maxZoom: 19
    });

    capasBase['osm'].addTo(mapa);
}

function crearControlCapasPersonalizado() {
    // Eliminar control anterior si existe
    if (controlCapasPersonalizado) {
        controlCapasPersonalizado.remove();
        controlCapasPersonalizado = null;
    }

    // Crear el control personalizado
    controlCapasPersonalizado = L.Control.extend({
        options: {
            position: 'topright'
        },
        
        onAdd: function(map) {
            this._map = map;
            const container = L.DomUtil.create('div', 'leaflet-control-layers');
            container.style.background = 'white';
            container.style.padding = '10px';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            container.style.minWidth = '200px';
            container.style.maxHeight = '80vh';
            container.style.overflowY = 'auto';
            container.style.transition = 'all 0.3s ease';
            
            // Título del control
            const title = document.createElement('div');
            title.style.display = 'flex';
            title.style.justifyContent = 'space-between';
            title.style.alignItems = 'center';
            title.style.cursor = 'pointer';
            title.style.padding = '4px 0';
            title.style.marginBottom = '8px';
            title.style.borderBottom = '2px solid #e0e0e0';
            
            const titleText = document.createElement('span');
            titleText.style.fontWeight = 'bold';
            titleText.style.fontSize = '14px';
            titleText.style.color = '#333';
            titleText.textContent = 'ℹ️ Información';
            
            const toggleIcon = document.createElement('span');
            toggleIcon.textContent = '▲';
            toggleIcon.style.fontSize = '12px';
            toggleIcon.style.color = '#666';
            toggleIcon.style.transition = 'transform 0.3s';
            
            title.appendChild(titleText);
            title.appendChild(toggleIcon);
            container.appendChild(title);
            
            // Contenido colapsable
            const content = document.createElement('div');
            content.className = 'leaflet-control-layers-content';
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease';
            container.appendChild(content);
            
            // Estado colapsado
            let collapsed = true;
            
            // Toggle click
            title.addEventListener('click', function(e) {
                e.stopPropagation();
                collapsed = !collapsed;
                if (collapsed) {
                    content.style.maxHeight = '0';
                    toggleIcon.textContent = '▲';
                } else {
                    content.style.maxHeight = '400px';
                    toggleIcon.textContent = '▼';
                }
            });
            
            // Agregar capas overlay al contenido
            const overlayTitle = document.createElement('div');
            overlayTitle.style.fontSize = '12px';
            overlayTitle.style.fontWeight = '600';
            overlayTitle.style.color = '#666';
            overlayTitle.style.marginBottom = '4px';
            overlayTitle.textContent = 'Selecciona una capa:';
            content.appendChild(overlayTitle);
            
            // Agregar capas overlay
            const overlayGroupName = 'capa_overlay';
            const ordenCapas = [
                'Alojamientos',
                'Carnicerías',
                'Farmacias',
                'Gastronomía',
                'Gomerías',
                'Guías de Pesca',
                'Prestadores Turísticos',
                'Puntos Turísticos',
                'Recuerdos',
                'Supermercados',
            ];
            
            ordenCapas.forEach(nombre => {
                if (capasOverlay[nombre]) {
                    const label = this._crearRadioLabel(
                        nombre,
                        overlayGroupName,
                        false,
                        true,
                        capasOverlay[nombre]
                    );
                    content.appendChild(label);
                }
            });
            
            // Mostrar popup de bienvenida
            this._mostrarPopupBienvenida();
            
            return container;
        },
        
        _crearRadioLabel: function(nombre, groupName, checked, isOverlay, layer) {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
            label.style.padding = '4px 6px';
            label.style.borderRadius = '4px';
            label.style.fontSize = '13px';
            label.style.transition = 'all 0.2s';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = groupName;
            input.checked = checked;
            input.style.marginRight = '8px';
            input.style.width = '16px';
            input.style.height = '16px';
            input.style.accentColor = '#3498db';
            input.style.cursor = 'pointer';
            
            // Guardar referencia a la capa
            input._layer = layer;
            input._nombre = nombre;
            input._isOverlay = isOverlay;
            
            // Evento al cambiar
            input.addEventListener('change', (e) => {
                this._onRadioChange(e.target);
                // Colapsar el control después de seleccionar
                this._colapsarControl();
            });
            
            const span = document.createElement('span');
            span.textContent = nombre;
            
            label.appendChild(input);
            label.appendChild(span);
            
            // Hover
            label.addEventListener('mouseenter', () => {
                if (!input.checked) {
                    label.style.backgroundColor = '#f5f5f5';
                }
            });
            label.addEventListener('mouseleave', () => {
                if (!input.checked) {
                    label.style.backgroundColor = '';
                }
            });
            
            // Si está checked, aplicar estilo
            if (checked) {
                label.style.fontWeight = 'bold';
                label.style.color = '#3498db';
            }
            
            return label;
        },
        
        _onRadioChange: function(input) {
            const nombre = input._nombre;
            const layer = input._layer;
            const isOverlay = input._isOverlay;
            
            if (isOverlay) {
                // Para overlays: desactivar todas las demás capas overlay
                Object.keys(capasOverlay).forEach(key => {
                    const capa = capasOverlay[key];
                    if (capa !== layer && this._map.hasLayer(capa)) {
                        this._map.removeLayer(capa);
                    }
                });
                
                // Activar la capa seleccionada
                if (!this._map.hasLayer(layer)) {
                    this._map.addLayer(layer);
                }
                
                // Mostrar la leyenda
                setTimeout(() => {
                    mostrarLeyenda(nombre);
                }, 50);
                
                // Actualizar estilos de los labels
                this._actualizarEstilos();
            }
        },
        
        _actualizarEstilos: function() {
            const container = this._container;
            if (!container) return;
            
            const labels = container.querySelectorAll('label');
            const inputs = container.querySelectorAll('input[type="radio"]');
            
            inputs.forEach((input, index) => {
                const label = labels[index];
                if (!label) return;
                
                if (input.checked && input._isOverlay) {
                    label.style.fontWeight = 'bold';
                    label.style.color = '#3498db';
                } else if (input._isOverlay) {
                    label.style.fontWeight = 'normal';
                    label.style.color = '';
                }
            });
        },
        
        _colapsarControl: function() {
            const container = this._container;
            if (!container) return;
            
            const content = container.querySelector('.leaflet-control-layers-content');
            const toggleIcon = container.querySelector('span:last-child');
            
            if (content) {
                content.style.maxHeight = '0';
                if (toggleIcon) {
                    toggleIcon.textContent = '▲';
                }
            }
        },
        
        _mostrarPopupBienvenida: function() {
            // Mostrar popup después de 1 segundo
            setTimeout(() => {
                const popupContent = `
                    <div style="padding: 5px;">
                        <strong>¡Hola!</strong><br>
                        Haz clic en <strong>ℹ️ Información</strong> para
                        explorar los distintos puntos de interés.
                    </div>
                `;
                
                const popup = L.popup({
                    className: 'welcome-popup',
                    closeButton: true,
                    autoClose: true,
                    closeOnClick: true,
                    maxWidth: 250
                })
                .setLatLng([-37.375, -70.265])
                .setContent(popupContent)
                .openOn(mapa);
                
                // Cerrar después de 5 segundos
                setTimeout(() => {
                    mapa.closePopup(popup);
                }, 5000);
            }, 1000);
        }
    });
    
    // Crear instancia del control y agregarlo al mapa
    const control = new controlCapasPersonalizado();
    control.addTo(mapa);
    
    // Escuchar eventos de capas para mantener sincronizado
    mapa.on('overlayadd', function(event) {
        const nombre = event.name;
        capaActiva = event.layer;
        mostrarLeyenda(nombre);
        actualizarRadioButtonsPersonalizado();
    });
    
    mapa.on('overlayremove', function(event) {
        if (capaActiva === event.layer) {
            capaActiva = null;
            ocultarLeyenda();
        }
        actualizarRadioButtonsPersonalizado();
    });
}

function actualizarRadioButtonsPersonalizado() {
    const container = document.querySelector('.leaflet-control-layers');
    if (!container) return;
    
    const inputs = container.querySelectorAll('input[type="radio"]');
    const labels = container.querySelectorAll('label');
    
    inputs.forEach((input, index) => {
        const label = labels[index];
        if (!label || !input._isOverlay) return;
        
        const capa = input._layer;
        if (capa && capaActiva === capa) {
            input.checked = true;
            label.style.fontWeight = 'bold';
            label.style.color = '#3498db';
        } else if (capa) {
            input.checked = false;
            label.style.fontWeight = 'normal';
            label.style.color = '';
        }
    });
}

function getMapa() {
    return mapa;
}

function getCapasBase() {
    return capasBase;
}

function getCapasOverlay() {
    return capasOverlay;
}

function getCapaActiva() {
    return capaActiva;
}