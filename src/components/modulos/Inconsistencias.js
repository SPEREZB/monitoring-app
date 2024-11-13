import { useEffect, useState } from 'react'; 
import InconsistenciaProvider from "../../provider/InconsistenciaProvider";
import alertas from "../../utilities/alerts/alerts";
import RepairLoad from '../statesLoad/RepairLoad';
import SandClockLoad from '../statesLoad/SandClockLoad'; 

const Inconsistencias = () => { 
  
  const {
    datos,
    setDatos,
    ruta,
    setRuta,
    analizando,
    setAnalizando,
    analizarInconsistency,
    resolverInconsistency,
    resolverConst,
    setResolverConst
  } = InconsistenciaProvider();
 
  const analizarDatos = async () => {
    if (!ruta) {
      alertas("Advertencia", "Por favor, ingresa una ruta válida.","warning");
      return;
    }
    setAnalizando(true);
    try {
      const nuevosDatos = await analizarInconsistency(ruta);
      setDatos(nuevosDatos);
      alertas("Exito", "Datos analizados con exito.","success");
    } catch (error) {
      console.error('Error al analizar los datos:', error);
    } finally {
      setAnalizando(false);
    }
  }; 

  useEffect(() => {
     
  }, []);

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col text-center">
        <h1 className="display-6 text-danger fw-bold d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-danger"></i>  
            Módulo para comprobar inconsistencias
          </h1>
        </div>
      </div>

      {resolverConst && ( 
       <RepairLoad />
      )}

      {analizando && ( 
       <SandClockLoad />
      )}
 
 
      <div className="row mb-4 justify-content-center">
        <div className="col-md-8">
          <div className="input-group shadow-sm">
          <span className="input-group-text bg-light">
    <i className="bi bi-folder text-danger"></i>  
  </span>
  <input
    type="text"
    className="form-control form-control-lg"
    placeholder="Ingresa la ruta a analizar"
    value={ruta}
    onChange={(e) => setRuta(e.target.value)}
  />
            <button
              className="btn btn-danger fw-bold"
              type="button"
              onClick={analizarDatos}
              disabled={analizando}
            >
                <i className={`bi bi-hourglass-split ${analizando ? 'me-2' : ''}`}></i>
              {analizando ? 'Analizando...' : 'Analizar'}
            </button>
          </div>
        </div>
      </div> 
 
      <div className="table-responsive mt-4 shadow-sm">
      <table className="table table-striped table-hover align-middle">
      <thead className="table-danger text-start">
        <tr>
          <th>ID</th>
          <th>Nombre del archivo</th>
          <th>Fecha de análisis</th>
          <th>Estado</th> 
        </tr>
      </thead>
      <tbody>
        {datos && (
          datos.length > 0 ? (
            datos.map((dato) => (
              <tr key={dato.id}>
                <td className="text-center fw-bold">{dato.id}</td>
                <td>{dato.nombre}</td>
                <td>{dato.fecha}</td>
                <td className="text-start">
                <span
                className={`badge rounded-pill px-3 py-2 shadow-sm align-items-center ${
                  dato.estado === 'Inconsistente'
                    ? 'bg-danger text-dark'
                    : dato.estado === 'Carpeta'
                    ? 'bg-warning text-dark'
                    : 'bg-success'
                }`}
              >
                <i
                  className={`bi ${
                    dato.estado === 'Inconsistente'
                      ? 'bi-x-circle'
                      : dato.estado === 'Carpeta'
                      ? 'bi-folder'
                      : 'bi-check-circle'
                  } me-2`}
                ></i>
                {dato.estado}
              </span>

                </td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-3 text-muted">
                No se encontraron datos
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
      </div>
    </div>
  );
};

export default Inconsistencias;
