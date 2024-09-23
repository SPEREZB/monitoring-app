import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import io from 'socket.io-client'; 

const MySwal = withReactContent(Swal);
const socket = io("http://127.0.0.1:5000");  

const Mantenimiento = () => {
  const [alerts, setAlerts] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [disk, setDisk] = useState([]);
  const [smartDevices, setSmartDevices] = useState([]); 
  const [selectedDisk, setSelectedDisk] = useState(null); 

  const [diskUsagePercent, setDiskUsagePercent] = useState(0);
  const [diskErrors, setDiskErrors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const socketIO = () => {
    socket.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
    });

    socket.on('new_alert', (newAlerts) => {
      try {
        if (!newAlerts || !newAlerts.disk || newAlerts.disk.length === 0) {
          throw new Error('El disco ha sufrido un error o ha sido retirado');
        }
        setIsError(false);

        console.log('Nuevas alertas recibidas:', newAlerts);
        setAlerts(newAlerts.alerts);
        setDefinitions(newAlerts.definitions);
        handleNewAlert(newAlerts.alerts, newAlerts.definitions);
  
        setDiskUsagePercent(newAlerts.disk[0]);
        setDiskErrors(newAlerts.disk[1]);
         
        setIsLoading(false);
      } catch (error) {
        console.error(error.message); 
        MySwal.fire({
          title: 'Error de Disco',
          text: 'El disco ha sufrido un error o ha sido retirado.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        setIsError(true);
        setIsLoading(false);
      }
    });

    return () => {
      socket.off('new_alert');
    };
  };

  const choose_disk = async (diskEscogido) => {
    setSelectedDisk(diskEscogido); 
    const response = await axios.post("http://127.0.0.1:5000/api/choose_devices", { name: diskEscogido });
    socketIO();
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/get_devices");
        setDisk(response.data.devices);
        setSmartDevices(response.data.smartctl_devices);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const handleNewAlert = async (newAlerts, definitions) => {
    let startIndex = 0;
  
    while (startIndex < newAlerts.length) {
      let criticalIndex = newAlerts.findIndex((alert, index) => index >= startIndex && alert.includes("Estado: Crítico"));
  
      if (criticalIndex === -1) break;
  
      const alert = newAlerts[criticalIndex];
      const alertKey = alert.split(" ")[0];
  
      const description = definitions[criticalIndex] || 'Se ha detectado una alerta crítica.';
  
      await MySwal.fire({
        title: '¡Alerta Crítica!',
        text: description,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
  
      startIndex = criticalIndex + 1;
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Seleccionar Disco</h1>
        </Col>
      </Row>

      {isLoading ? (
        <Row className="justify-content-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </Row>
      ) : isError ? (
        <Row className="justify-content-center mt-5">
          <p className="text-center text-danger">Ha ocurrido un error al obtener los discos.</p>
        </Row>
      ) : (
        <Row className="mt-4">
          {disk.length === 0 ? (
            <Col>
              <p>No hay discos disponibles.</p>
            </Col>
          ) : (
            disk.map((diskItem, index) => (
              <Col md={4} key={index}>
                <Card className="mb-3" onClick={() => choose_disk(smartDevices[index])} style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>
                      <i className="bi bi-hdd-fill me-2"></i>  
                      {diskItem.filesystem}
                    </Card.Title>
                    <Card.Text>
                      Tamaño del disco: {diskItem.size} 
                    </Card.Text>
                    <Card.Text>
                      Espacio utilizado: {diskItem.used} 
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}

  
      {selectedDisk && (
        <>
          <Row>
            <Col>
              <h1 className="text-center">Monitoreo de Almacenamiento</h1>
            </Col>
          </Row>
        
          <Row>
            <Col md={6}>
              <Card className="bg-info text-white mb-3">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-hdd-fill me-2"></i>
                    Almacenamiento del Disco
                  </Card.Title>
                  <Card.Text>{diskUsagePercent}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="bg-warning text-dark mb-3">
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Errores en el Disco
                  </Card.Title>
                  <Card.Text>
                    {diskErrors > 0 ? `${diskErrors}` : `El disco no tiene errores`} 
                    <br />
                    Tasa de detección automática de errores: 98%
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h3 className="text-left">Propiedades del disco obtenidas por la función SMART</h3>
            </Col>
          </Row>

          <Row>
            {alerts.length === 0 ? (
              <Col>
                <p>No se han registrado alertas.</p>
              </Col>
            ) : (
              alerts.map((alert, index) => {
                const estado = alert.includes("Estado: Crítico") ? "Crítico" : "Buen estado";
                const alertClass = estado === "Buen estado" ? "bg-success text-white" : "bg-danger text-white";
                const icon = estado === "Buen estado" ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
                return (
                  <Card className={`${alertClass} mb-3`} key={index}>
                    <Card.Body>
                      <Card.Title>
                        <i className={`bi ${icon} me-2`}></i>
                        {alert}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Mantenimiento;
