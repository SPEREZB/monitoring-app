import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Discos from "../complementos/Discos"; 
import { Container, Card, Button, Form, Alert, Row, Col, ProgressBar, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import balanza from './../../assets/balanza.gif'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Almacenamiento = () => {
  const [storageInfo, setStorageInfo] = useState({
    capacity: 100,
    used_space: 40,
    available_space: 60,
  });
  const [usedSpace, setUsedSpace] = useState('');
  const [capacity, setCapacity] = useState('');
  const [demand, setDemand] = useState('');
  const [addSpace, setAddSpace] = useState('');
  const [releaseSpace, setReleaseSpace] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balancing, setBalancing] = useState(false); 
  const [reloadDiscos, setReloadDiscos] = useState(false); 

  const [disk, setDisk] = useState([]);
  const [smartDevices, setSmartDevices] = useState([]); 
  const [selectedDiskIndex, setSelectedDiskIndex] = useState(null);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchStorageInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/data');
      setStorageInfo(response.data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      setError('Error al obtener información de almacenamiento');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const adjustCapacityAutomatically = (newUsedSpace) => {
    if (newUsedSpace / storageInfo.capacity > 0.8) {
      const newCapacity = Math.ceil(newUsedSpace * 1.2);
      setStorageInfo((prevInfo) => ({
        ...prevInfo,
        capacity: newCapacity,
        available_space: newCapacity - newUsedSpace,
      }));
      setSuccess('La capacidad de almacenamiento ha sido ajustada automáticamente.');
    }
  };

  const handleModifySpaceAndCapacity = (e) => {
    e.preventDefault();
    const newUsedSpace = parseInt(usedSpace);
    const newCapacity = parseInt(capacity);
    if (newUsedSpace > newCapacity) {
      setError('El espacio utilizado no puede ser mayor que la capacidad total.');
      setSuccess(null);
    } else {
      setStorageInfo({
        capacity: newCapacity,
        used_space: newUsedSpace,
        available_space: newCapacity - newUsedSpace,
      }); 
      setSuccess('Espacio y capacidad actualizados correctamente.');
      setError(null);
    }
  };

  const handleAdjustDemand = async (e) => {
    e.preventDefault();
    const newDemand = parseInt(demand);
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/data/adjust', { demand: newDemand });
         
        const data = await response.data; 
        setStorageInfo({
          capacity: data.capacity,    
          used_space: data.used_space,  
          available_space: data.available_space, 
        });
        setSuccess('Capacidad ajustada según la demanda.');
        setError(null); 
    } catch (err) {
      setError('Error al ajustar la capacidad de almacenamiento.');
      setSuccess(null);
    }
  };

  const liberarEspacio = () => {
    const newAvailableSpace = storageInfo.available_space + 10;
    const newUsedSpace = storageInfo.used_space - 10;
    if (newUsedSpace < 0) {
      setError('No puedes liberar más espacio del que está utilizado.');
      setSuccess(null);
    } else {
      setStorageInfo({
        ...storageInfo,
        available_space: newAvailableSpace,
        used_space: newUsedSpace
      });
      setSuccess('Espacio liberado con éxito');
      setError(null);
    }
  };

  const handleBalanceDisks = async () => {
    try {  
      setBalancing(true);
      // const response = await axios.post('http://127.0.0.1:5000/api/data/balance', { disk });
      // setBalancing(false);
      
      // const data = response.data;
      
      // if (data.status === 'Balance completado') {
      //   setDisk(data.disks);  
      //   setReloadDiscos((prev) => !prev);
      //   setSuccess('Discos balanceados correctamente.');
      //   setError(null);
      // } else {
      //   setError('Error al balancear discos');
      // }
    } catch (err) {
      setError('Error al balancear discos');
      setSuccess(null);
    }
  };
  
  

  const handleDiskSelection = (index, device) => {
    setIsLoading(true);
    diskIndex = index;
    setSelectedDiskIndex(index);
    hasShownCriticalAlert = false;
    choose_disk(device, index);
  }; 

  let diskIndex;
  let hasShownCriticalAlert = false;

  const choose_disk = async (diskEscogido, index) => {
    setSelectedDisk(diskEscogido);

    await axios.post(
      "http://127.0.0.1:5000/api/choose_devices",
      { name: diskEscogido }
    ); 
  };

  useEffect(() => {
    fetchStorageInfo();
  }, []);

  const porcentajeUsado = (storageInfo.used_space / storageInfo.capacity) * 100;

  // Alertas críticas según las condiciones establecidas
  useEffect(() => {
    if (porcentajeUsado > 80) {
      MySwal.fire({
        title: "¡Alerta Crítica!",
        text: "El almacenamiento supera el 80%. ¡Considera añadir otro disco!",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }

    if (porcentajeUsado === 100) {
      MySwal.fire({
        title: "¡Peligro de fallo en el disco!",
        text: "El uso del disco está al 100%. Esto podría malograr el disco. ¡Libera espacio de inmediato!",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    if (selectedDisk && porcentajeUsado > 90) {
      MySwal.fire({
        title: `Disco ${selectedDisk} al límite`,
        text: "El disco seleccionado está casi lleno. ¡Considera retirarlo antes de dañarlo!",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  }, [porcentajeUsado, selectedDisk]);

  return (
    <Container className="mt-5">
         <Discos
                key={reloadDiscos}
                disk={disk} 
                smartDevices={smartDevices}  
                setDisk={setDisk}  
                setSmartDevices={setSmartDevices}  
                setIsLoading={setIsLoading}
                selectedDiskIndex={selectedDiskIndex}   
                handleDiskSelection={handleDiskSelection} 
            />
      {loading && (
        <div className="text-center mb-4"> 
            <span className="sr-only">Cargando...</span> 
        </div>
      )}

      <h1 className="text-center">Gestión de Almacenamiento <i className="bi bi-hdd-stack"></i></h1>


      <div className="text-center mb-4">
        <Button
          variant="warning"
          onClick={handleBalanceDisks}
          className="btn-lg rounded-pill shadow"
          >
          <i className="bi bi-box-arrow-in-down me-2"></i>  
          Ajustar Almacenamiento
        </Button>
      </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
      {balancing && (
  <div className="overlay">
  <div className="overlay-content-balanced">
    <img 
      src={balanza} 
      alt="Balanceando..." 
      style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
    />
    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
      Ajustando el espacio entre los discos, por favor espera...
    </p>
  </div>
</div> 
      )}

      {storageInfo && (
        <Card className="mb-4 shadow-lg">
          <Card.Body>
            <Row className="text-center mb-4">
              <Col>
                <i className="bi bi-hdd-network" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
                <Card.Title>Información de Almacenamiento "Simulación de un disco real"</Card.Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card.Text>
                  <i className="bi bi-hdd" style={{ marginRight: '10px' }}></i>
                  <strong>Capacidad Total:</strong> {storageInfo.capacity} GB
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  <i className="bi bi-cloud-upload-fill" style={{ marginRight: '10px' }}></i>
                  <strong>Espacio Utilizado:</strong> {storageInfo.used_space} GB
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  <i className="bi bi-hdd-fill" style={{ marginRight: '10px' }}></i>
                  <strong>Espacio Disponible:</strong> {storageInfo.available_space} GB
                </Card.Text>
              </Col>
            </Row>

            <ProgressBar
              now={porcentajeUsado}
              label={`${porcentajeUsado.toFixed(2)}% usado`}
              variant={porcentajeUsado > 80 ? 'danger' : 'success'}
              className="mb-3"
            />
          </Card.Body>
        </Card>
      )}
 
      <Card className="mb-4 shadow-lg">
        <Card.Body> 
        <Form onSubmit={handleModifySpaceAndCapacity}>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad Total</Form.Label>
            <Form.Control
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="0" // Solo permite números positivos
              placeholder="Introduce la capacidad total en GB"
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Espacio Utilizado</Form.Label>
            <Form.Control
              type="number"
              value={usedSpace}
              onChange={(e) => setUsedSpace(e.target.value)}
              min="0" // Solo permite números positivos
              placeholder="Introduce el espacio utilizado en GB"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad Total</Form.Label>
            <Form.Control
              type="range"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="0"
              max="1000" 
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Espacio Utilizado</Form.Label>
            <Form.Control
              type="range"
              value={usedSpace}
              onChange={(e) => setUsedSpace(e.target.value)}
              min="0"
              max={capacity}  
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit">
        Actualizar Espacio y Capacidad
      </Button>
    </Form>
        </Card.Body>
      </Card>
 
      <Row> 

      {/* Tarjeta de Liberar Espacio de Almacenamiento */}
      <Col xs={12} md={6}>
        <Card className="mb-4 shadow-lg">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label htmlFor="releaseRange" className="form-label">
                Liberar Espacio: {releaseSpace} GB
              </label> 
            </div>
            <input
              id="releaseRange"
              type="range"
              value={releaseSpace}
              onChange={(e) => setReleaseSpace(e.target.value)}
              min="0"
              max="500" // Máximo configurable para liberar espacio
              style={{ accentColor: 'red', width: '100%' }}
            />
            <Button className="mt-3" variant="danger" onClick={liberarEspacio}>
              Liberar Espacio
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </Container>
  );
};

export default Almacenamiento;
