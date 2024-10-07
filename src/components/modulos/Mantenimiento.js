import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Modal  } from "react-bootstrap"; 
import Error_Reports from "../complementos/Error_Reports";
import Discos from "../complementos/Discos";
import './../../styles/mantenimiento.css'; 
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import io from "socket.io-client";
import { socketIO } from "../../services/socketIO"

const MySwal = withReactContent(Swal); 
 

const Mantenimiento = () => {
  const [alerts, setAlerts] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [disk, setDisk] = useState([]);
  const [smartDevices, setSmartDevices] = useState([]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [selectedDiskIndex, setSelectedDiskIndex] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);  
  const [diskUsagePercent, setDiskUsagePercent] = useState(0);
  const [diskErrors, setDiskErrors] = useState(0);
  const [tasaDeteccion, setTasaDeteccion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const navigate = useNavigate(); 

  let diskIndex;
  let hasShownCriticalAlert = false;

    
  const choose_disk = async (diskEscogido, index) => {
    setSelectedDisk(diskEscogido);

   await axios.post(
      "http://127.0.0.1:5000/api/choose_devices",
      { name: diskEscogido }
    );
    socketIO(index,setAlerts,setDefinitions,setDiskUsagePercent,setDiskErrors,setTasaDeteccion,setIsLoading,setIsError,handleNewAlert);
  };

  const handleNewAlert = async (newAlerts, definitions) => {
    let startIndex = 0;
    while (startIndex < newAlerts.length) {
      let criticalIndex = newAlerts.findIndex(
        (alert, index) =>
          index >= startIndex && alert.includes("Estado: Crítico")
      );

      if (criticalIndex === -1) break;

      if (!hasShownCriticalAlert) {
        const alert = newAlerts[criticalIndex]; 

        const description =
          definitions[criticalIndex] || "Se ha detectado una alerta crítica.";

        await MySwal.fire({
          title: "¡Alerta Crítica!",
          text: description,
          icon: "error",
          confirmButtonText: "Aceptar",
        });

        hasShownCriticalAlert = true;
      }

      startIndex = criticalIndex + 1;
    }
  };

  const handleDiskSelection = (index, device) => {
    setIsLoading(true);
    diskIndex = index;
    setSelectedDiskIndex(index);
    hasShownCriticalAlert = false;
    choose_disk(device, index);
  }; 

  const navigateToErrorReports = () => { 
    navigate('reportes');
  };

  const closeOverlay = () => {
    setShowOverlay(false);  
  };


  return (
    <Container className="mt-1">
        <Discos
                disk={disk} 
                smartDevices={smartDevices}  
                setDisk={setDisk}  
                setSmartDevices={setSmartDevices}  
                setIsLoading={setIsLoading}
                selectedDiskIndex={selectedDiskIndex}   
                handleDiskSelection={handleDiskSelection} 
            />

      {selectedDisk ? (
        !isLoading ? (
          <>
            <Row>
              <Col>
                <h1 className="text-center">Monitoreo de Almacenamiento</h1>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Card
                  className="mb-3 shadow-sm border-0"
                  style={{
                    background: "linear-gradient(135deg, #17a2b8 40%, #138496)",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Body>
                    <Card.Title className="text-center d-flex align-items-center justify-content-center">
                      <i className="bi bi-hdd-fill me-2"></i>
                      Almacenamiento del Disco
                    </Card.Title>
                    <Card.Text className="text-center">
                      <span className="badge bg-light text-dark p-2">
                        {diskUsagePercent}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card
                  className="mb-3 shadow-sm border-0"
                  style={{
                    background: "linear-gradient(135deg, #ffc107 40%, #e0a800)",
                    color: "#212529",
                    borderRadius: "10px",
                  }}
                >
             <Card.Body className="position-relative">
        {/* Icono de interrogación en la esquina superior derecha */}
        <i 
          className="bi bi-question-circle-fill position-absolute" 
          style={{ top: "10px", right: "10px", fontSize: "1.2rem", cursor: "pointer" }}
          title="Más información sobre los errores en el disco"
          onClick={handleShowModal} // Abre el modal al hacer clic en el ícono
        ></i>

        <Card.Title className="text-center d-flex align-items-center justify-content-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Errores en el Disco
        </Card.Title>

        <Card.Text className="text-center">
          <span className="badge bg-light text-dark p-2">
            {tasaDeteccion !== undefined ? `${tasaDeteccion}` : `Sin errores`}
          </span>
          <br /> 
        </Card.Text>
      </Card.Body>

      {/* Modal de información */}
      <Modal
  show={showModal}
  onHide={handleCloseModal}
  centered // Para centrar el modal en la pantalla
  backdrop="static" // Impide que se cierre el modal al hacer clic fuera
>
  <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa", borderBottom: "none" }}>
    <Modal.Title className="d-flex align-items-center">
      <i className="bi bi-info-circle-fill me-2" style={{ color: "#0d6efd" }}></i>
      Información Importante
    </Modal.Title>
  </Modal.Header>
  
  <Modal.Body style={{ backgroundColor: "#fefefe", padding: "20px 30px", textAlign: "justify" }}> 
    <div className="alert alert-info" style={{ marginTop: "15px" }}>
      <i className="bi bi-check-circle-fill me-2"></i>
      Se verificará el porcentaje de errores encontrados en base a los errores detectados en el reporte de errores.
      En caso de que ya se hayan corregido esos errores, se podrá actualizar la lista del reporte con los reportes que se esten detectando.
    </div>
  </Modal.Body>
  
  <Modal.Footer style={{ backgroundColor: "#f8f9fa", borderTop: "none" }}>
    <Button
      variant="success"
      onClick={handleCloseModal}
      className="px-4"
      style={{ borderRadius: "50px", backgroundColor: "#ff6b6b", borderColor: "#198754" }}
    >
      <i className="bi bi-x-circle me-2"></i>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

                </Card>
              </Col>
            </Row>
            <Row className="mb-3">

          <Col> 
       
            <Button
              variant="danger"
              className="shadow-sm"
              style={{
                backgroundColor: "#dc3545",
                borderColor: "#dc3545",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "1.1rem",
              }}  
              onClick={() => navigateToErrorReports()} 
            > 

              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Reportes de errores encontrados
            </Button>
          </Col>

        </Row>
        
        {showOverlay && (
            <div className="overlay">
            <div className="overlay-content">
              <Button
                variant="secondary"
                className="close-overlay"
                onClick={closeOverlay}
                style={{
                  position: "absolute", 
                  top: "10px", 
                  left: "10px", 
                  zIndex: 10,  
                  backgroundColor: "#6c757d",  
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  padding: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                ✕  
              </Button>
              <Error_Reports alerts={alerts} />  
            </div>
          </div>
          
              )}


            <Row className="mt-2">
              <Col>
                <h3 className="text-left">
                  Propiedades del disco obtenidas por la función SMART
                </h3>
              </Col>
            </Row>

            <Row>
              <Col>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "15px",
                    backgroundColor: "#f0f2f5",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="alert-nav">
                    {alerts.length === 0 ? (
                      <p
                        className="text-muted text-center"
                        style={{ fontStyle: "italic" }}
                      >
                        No se han registrado alertas.
                      </p>
                    ) : (
                      alerts.map((alert, index) => {
                        const estado = alert.includes("Estado: Crítico")
                          ? "Crítico"
                          : "Buen estado";
                        const alertClass =
                          estado === "Buen estado"
                            ? "bg-light text-success"
                            : "bg-light text-danger";
                        const icon =
                          estado === "Buen estado"
                            ? "bi-check-circle-fill"
                            : "bi-exclamation-triangle-fill";
                        const borderClass =
                          estado === "Buen estado"
                            ? "border-success"
                            : "border-danger";

                        return (
                          <Card
                            className={`mb-3 shadow-sm border-start ${borderClass}`}
                            key={index}
                            style={{
                              borderRadius: "12px",
                              borderLeftWidth: "5px",
                              transition: "transform 0.3s",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.02)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            <Card.Body className="d-flex align-items-center justify-content-between">
                              <div>
                                <Card.Title className="mb-0 d-flex align-items-center">
                                  <i
                                    className={`bi ${icon} me-3`}
                                    style={{ fontSize: "1.5rem" }}
                                  ></i>
                                  <span
                                    className="fw-bold"
                                    style={{ fontSize: "1.1rem" }}
                                  >
                                    {alert}
                                  </span>
                                </Card.Title>
                              </div>
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {estado === "Buen estado"
                                  ? "Todo está en orden"
                                  : "¡Atención necesaria!"}
                              </small>
                            </Card.Body>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Row className="justify-content-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </Row>
        )
      ) : null}
    </Container>
  );
};

export default Mantenimiento;
