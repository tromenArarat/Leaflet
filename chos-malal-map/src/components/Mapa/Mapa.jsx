import { MapContainer, TileLayer } from 'react-leaflet';
import CapaBarrios from './CapaBarrios';
import { useMapaContext } from '../../context/MapaContext';
import './Mapa.css';

function Mapa() {
  const { centro, zoom } = useMapaContext();

  return (
    <MapContainer 
      center={centro || [-37.372246, -70.274423]} 
      zoom={zoom || 13} 
      className="mapa-container"
    >
      {/* Capa OSM */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Capa IGN */}
      <TileLayer
        attribution='<a href="http://www.ign.gob.ar">IGN</a>'
        url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
        minZoom={3}
        maxZoom={30}
      />
      
      {/* Capa Satelital */}
      <TileLayer
        attribution='Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        minZoom={3}
        maxZoom={30}
      />
      
      {/* Capa de Barrios */}
      <CapaBarrios />
    </MapContainer>
  );
}

export default Mapa;