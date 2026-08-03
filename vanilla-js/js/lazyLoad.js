
export function mostrarCargando() {
    const loading = document.getElementById('loading-indicator');
    loading.style.display = 'block';
}

export function ocultarCargando() {
    const loading = document.getElementById('loading-indicator');
    loading.style.display = 'none';
}

export function cargarGeoJSON(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error HTTP: ' + response.status);
            return response.json();
        })
        .catch(error => {
            console.error('Error cargando:', error);
            return null;
        });
}

export function verificarLayer(layerCargar, estilo, url, propiedades) {
    if (!layerCargar.load) {
        mostrarCargando();
        cargarGeoJSON(url).then(datos => {
            if (datos) {
                layerCargar.addData(datos);
                layerCargar.eachLayer(function(layer) {
                    const props = layer.feature.properties;
                    let msgPopup = "";
                    
                    propiedades.forEach(function(prop) {
                        const valor = props[prop.propiedad];
                        // Si el valor es null o undefined, mostramos "N/A"
                        const texto = (valor !== null && valor !== undefined) ? valor : "N/A";
                        
                        if (prop.titulo === "Titulo") {
                            msgPopup = `<b>${texto}</b><br>` + msgPopup;
                        } else {
                            // Si es el campo "id" que es número, no mostramos decimales
                            if (prop.propiedad === "id" && typeof texto === 'number') {
                                msgPopup += `${prop.titulo}: ${Math.round(texto)}<br>`;
                            } else {
                                msgPopup += `${prop.titulo}: ${texto}<br>`;
                            }
                        }
                    });
                    
                    layer.bindPopup(msgPopup);
                });
                
                layerCargar.setStyle(estilo);
                console.log('Capa de barrios cargada bajo demanda');
                layerCargar.load = true;
                ocultarCargando();
            }
        }).catch(error => {
            console.error('Error cargando el GeoJSON:', error);
            ocultarCargando();
        });
    }
}

