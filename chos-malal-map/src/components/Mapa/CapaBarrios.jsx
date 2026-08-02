import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { getStyle, onEachFeature } from '../../utils/estilos';
import { useMapaContext } from '../../context/MapaContext';

function CapaBarrios() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const { setBarrios, setCargando } = useMapaContext();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await fetch('/data/barrios.geojson');
        if (!response.ok) throw new Error('Error cargando datos');
        const data = await response.json();
        setDatos(data);
        setBarrios(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [setBarrios, setCargando]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!datos) return <div className="cargando">Cargando barrios...</div>;

  return (
    <GeoJSON 
      data={datos}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  );
}

export default CapaBarrios;