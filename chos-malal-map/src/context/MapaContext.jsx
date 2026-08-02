import { createContext, useState, useContext } from 'react';

const MapaContext = createContext();

export function MapaProvider({ children }) {
  const [centro, setCentro] = useState([-37.372246, -70.274423]);
  const [zoom, setZoom] = useState(13);
  const [barrios, setBarrios] = useState(null);
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const value = {
    centro,
    setCentro,
    zoom,
    setZoom,
    barrios,
    setBarrios,
    barrioSeleccionado,
    setBarrioSeleccionado,
    cargando,
    setCargando
  };

  return (
    <MapaContext.Provider value={value}>
      {children}
    </MapaContext.Provider>
  );
}

export function useMapaContext() {
  const context = useContext(MapaContext);
  if (!context) {
    throw new Error('useMapaContext debe usarse dentro de MapaProvider');
  }
  return context;
}