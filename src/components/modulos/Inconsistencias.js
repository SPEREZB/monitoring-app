import { useEffect, useState } from "react";
import { Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import InconsistenciaProvider from "../../provider/InconsistenciaProvider";
import alertas from "../../utilities/alerts/alerts";
import RepairLoad from "../statesLoad/RepairLoad";
import SandClockLoad from "../statesLoad/SandClockLoad";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "../../styles/inconsistency.css";

const Inconsistencias = () => {
  const {
    datos,
    setDatos,
    datosParidad,
    setDatosParidad,
    ruta,
    setRuta,
    rutaVerParidad,
    setRutaVerParidad,
    analizando,
    setAnalizando,
    verificando,
    setVerificando,
    analizarInconsistency,
    analizarParidad,
    resolverConst,
    setResolverConst,
  } = InconsistenciaProvider();

  const analizarDatos = async () => {
    if (!ruta) {
      alertas("Advertencia", "Por favor, ingresa una ruta válida.", "warning");
      return;
    }
    setAnalizando(true);
    try {
      const nuevosDatos = await analizarInconsistency(ruta);
      setDatos(nuevosDatos);
      alertas("Exito", "Datos analizados con exito.", "success");
    } catch (error) {
      console.error("Error al analizar los datos:", error);
    } finally {
      setAnalizando(false);
    }
  };

  const verificarParidad = async () => {
    if (!rutaVerParidad) {
      alertas("Advertencia", "Por favor, ingresa una ruta válida.", "warning");
      return;
    }
    setVerificando(true);
    const nuevosDatos = await analizarParidad(rutaVerParidad);
    setDatosParidad(nuevosDatos);
    setVerificando(false);
    alertas("Exito", "Paridad de archivos obtenida.", "success");
  };

  useEffect(() => {}, []);

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

      {resolverConst && <RepairLoad />}

      {analizando || (verificando && <SandClockLoad />)}

      <div className="d-flex align-items-start gap-3">
        <div className="d-flex align-items-center mb-3">
          <p className="fw-bold mb-0 me-2">¿Qué es la paridad?</p>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-parity" className="custom-tooltip">
                <div>
                  <p>
                    <strong className="tooltip-title text-success">
                      ¿Qué es la paridad?
                    </strong>
                  </p>
                  <p>
                    La paridad es una técnica utilizada para verificar la
                    integridad de los datos. Se basa en sumar la cantidad de
                    bits con valor "1" en un archivo o dato, determinando si
                    esta suma es par o impar. Esto permite detectar posibles
                    errores de transmisión o almacenamiento.
                  </p>
                </div>
              </Tooltip>
            }
          >
            <button
              className="btn btn-link text-success"
              style={{ fontSize: "1.5rem" }}
            >
              <i className="bi bi-question-circle-fill"></i>
            </button>
          </OverlayTrigger>
        </div>

        <div className="d-flex align-items-center mb-3">
          <p className="fw-bold mb-1">¿Cómo funciona este módulo?</p>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                id="tooltip-module"
                className="custom-tooltip tooltip-large"
              >
                <div className="w-100">
                  <p>
                    <strong className="tooltip-title text-info">
                      ¿Cómo funciona este módulo?
                    </strong>
                  </p>
                  <p className="tooltip-text">
                    Analiza la consistencia de los archivos comparando su
                    paridad esperada con la actual. Si detecta un cambio en la
                    paridad, clasifica el archivo como inconsistente e indica el
                    motivo del problema. También muestra la paridad previa y la
                    nueva, ayudando a identificar errores específicos.
                  </p>
                </div>
              </Tooltip>
            }
          >
            <button
              className="btn btn-link text-info"
              style={{ fontSize: "1.5rem" }}
            >
              <i className="bi bi-info-circle-fill"></i>
            </button>
          </OverlayTrigger>
        </div>
      </div>

      <div className="row mb-4 justify-content-center">
      <div className="col-md-6">
          <div className="input-group shadow-sm">
          <InputGroup className="mb-3">
  <InputGroup.Text>
    <span className="input-group-text bg-light">
      <i className="bi bi-file-earmark-text text-warning"></i>
    </span>
  </InputGroup.Text>
  <Form.Control
    type="text"
    name="rutaParidad" /* Nombre único para este campo */
    className="form-control form-control-lg"
    placeholder="Ver paridad de archivos registrados"
    value={rutaVerParidad}
    onChange={(e) => setRutaVerParidad(e.target.value)}
    autoComplete="on" /* Activar autocompletado */
    style={{
      borderRadius: "0 8px 8px 0",
      border: "1px solid #ffc107",
      boxShadow: "0px 2px 5px rgba(255, 193, 7, 0.2)",
    }}
  />
  <button
    className="btn btn-warning fw-bold"
    type="button"
    onClick={verificarParidad}
    disabled={verificando}
  >
    <i
      className={`bi bi-check-circle me-2 ${verificando ? "me-2" : ""}`}
    ></i>
    {verificando ? "Verificando..." : "Verificar Paridad"}
  </button>
</InputGroup>

          </div>

          <div className="table-responsive mt-2 shadow-sm">
            <table className="table table-striped table-hover align-middle">
            <thead className="table-danger text-start small">
            <tr>
              <th>
                <i className="bi bi-hash me-2"></i>ID
              </th>
              <th>
                <i className="bi bi-file-earmark-text me-2"></i>Nombre del archivo
              </th>
              <th>
                <i className="bi bi-calendar me-2"></i>Fecha de análisis
              </th>
              <th>
                <i className="bi bi-flag me-2"></i>Estado
              </th>
              <th>
                <i className="bi bi-info-circle me-2"></i>Detalles
              </th>
            </tr>
          </thead>

              <tbody className="small">
                {datosParidad &&
                  (datosParidad.length > 0 ? (
                    datosParidad.map((dato) => (
                      <tr key={dato.id}>
                        <td className="text-center fw-bold">{dato.id}</td>
                        <td>{dato.nombre}</td>
                        <td>{dato.fecha}</td>
                        <td className="text-start">
                          <span
                            className={`badge rounded-pill px-3 py-2 shadow-sm align-items-center ${
                              dato.estado === "Inconsistente"
                                ? "bg-danger text-dark"
                                : dato.estado === "Carpeta"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            <i
                              className={`bi ${
                                dato.estado === "Inconsistente"
                                  ? "bi-x-circle"
                                  : dato.estado === "Carpeta"
                                  ? "bi-folder"
                                  : "bi-check-circle"
                              } me-2`}
                            />
                            {dato.estado}
                          </span>
                        </td>
                        <td>{dato.detalles}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-3 text-muted">
                        No se encontraron datos
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group shadow-sm">
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <span className="input-group-text bg-light">
                  <i className="bi bi-folder text-danger"></i>
                </span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="ruta"
                className="form-control form-control-lg"
                placeholder="Ingresa la ruta para analizar"
                value={ruta}
                onChange={(e) => setRuta(e.target.value)}
                style={{
                  borderRadius: "0 8px 8px 0",
                  border: "1px solid #dc3545",
                  boxShadow: "0px 2px 5px rgba(40, 167, 69, 0.2)",
                }}
              />
              <button
                className="btn btn-danger fw-bold"
                type="button"
                onClick={analizarDatos}
                disabled={analizando}
              >
                <i
                  className={`bi bi-hourglass-split ${
                    analizando ? "me-2" : ""
                  }`}
                ></i>
                {analizando ? "Analizando..." : "Analizar"}
              </button>
            </InputGroup>
          </div>

          <div className="table-responsive mt-2 shadow-sm">
            <table className="table table-striped table-hover align-middle">
            <thead className="table-danger text-start small">
            <tr>
              <th>
                <i className="bi bi-hash me-2"></i>ID
              </th>
              <th>
                <i className="bi bi-file-earmark-text me-2"></i>Nombre del archivo
              </th>
              <th>
                <i className="bi bi-calendar me-2"></i>Fecha de análisis
              </th>
              <th>
                <i className="bi bi-flag me-2"></i>Estado
              </th>
              <th>
                <i className="bi bi-info-circle me-2"></i>Detalles
              </th>
            </tr>
          </thead>

              <tbody className="small">
                {datos &&
                  (datos.length > 0 ? (
                    datos.map((dato) => (
                      <tr key={dato.id}>
                        <td className="text-center fw-bold">{dato.id}</td>
                        <td>{dato.nombre}</td>
                        <td>{dato.fecha}</td>
                        <td className="text-start">
                          <span
                            className={`badge rounded-pill px-3 py-2 shadow-sm align-items-center ${
                              dato.estado === "Inconsistente"
                                ? "bg-danger text-dark"
                                : dato.estado === "Carpeta"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            <i
                              className={`bi ${
                                dato.estado === "Inconsistente"
                                  ? "bi-x-circle"
                                  : dato.estado === "Carpeta"
                                  ? "bi-folder"
                                  : "bi-check-circle"
                              } me-2`}
                            />
                            {dato.estado}
                          </span>
                        </td>
                        <td
                          className={
                            dato.detalles === "La paridad fue la esperada"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {dato.detalles}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-3 text-muted">
                        No se encontraron datos
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default Inconsistencias;
