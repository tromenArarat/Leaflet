import { useMapaContext } from '../../context/MapaContext';
import './PanelControl.css';

function PanelControl() {
  const { barrios, barrioSeleccionado, setBarrioSeleccionado } = useMapaContext();

  if (!barrios) return null;

  const listaBarrios = barrios.features || [];

  return (
    <div className="panel-control">
      <h3>Barrios de Chos Malal</h3>
      <select 
        value={barrioSeleccionado?.properties?.nombre || ''}
        onChange={(e) => {
          const barrio = listaBarrios.find(
            b => b.properties.nombre === e.target.value
          );
          setBarrioSeleccionado(barrio);
        }}
      >
        <option value="">Seleccionar barrio</option>
        {listaBarrios.map((barrio, index) => (
          <option key={index} value={barrio.properties.nombre}>
            {barrio.properties.nombre}
          </option>
        ))}
      </select>
      
      {barrioSeleccionado && (
        <div className="info-barrio">
          <h4>{barrioSeleccionado.properties.nombre}</h4>
          {/* Más información del barrio */}
        </div>
      )}
    </div>
  );
}

export default PanelControl;