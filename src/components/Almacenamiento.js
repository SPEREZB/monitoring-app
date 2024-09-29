import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form, Alert, Row, Col, ProgressBar, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Almacenamiento = () => {
  const [storageInfo, setStorageInfo] = useState({
    capacity: 100,
    used_space: 40,
    available_space: 60
  });
  const [usedSpace, setUsedSpace] = useState('');
  const [capacity, setCapacity] = useState('');
  const [demand, setDemand] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
 
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
        available_space: newCapacity - newUsedSpace
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
        available_space: newCapacity - newUsedSpace
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
  

  useEffect(() => {
    fetchStorageInfo();
  }, []);

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

  const porcentajeUsado = (storageInfo.used_space / storageInfo.capacity) * 100;

  return (
    <Container className="mt-5">
      <h1 className="text-center">Gestión de Almacenamiento <i className="bi bi-hdd-stack"></i></h1>

      {loading && (
        <div className="text-center mb-4">
          <Spinner animation="border" role="status">
            <span className="sr-only">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {storageInfo && (
        <>
          <Card className="mb-4 shadow-lg">
            <Card.Body>
              <Row className="text-center mb-4">
                <Col>
                  <i className="bi bi-hdd-network" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
                  <Card.Title>Información de Almacenamiento</Card.Title>
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

              <ProgressBar now={porcentajeUsado} label={`${Math.round(porcentajeUsado)}%`} className="mt-3" />

              <Card.Text className="mt-3">
              {porcentajeUsado === 100 ? (
              <Alert variant="danger">
                <i className="bi bi-exclamation-triangle-fill"></i> El almacenamiento está lleno.
              </Alert>
            ) : porcentajeUsado > 80 ? (
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle-fill"></i> El almacenamiento está casi lleno. ¡Considera liberar espacio!
              </Alert>
            ) : (
              <Alert variant="info">
                <i className="bi bi-info-circle-fill"></i> El almacenamiento está en un nivel óptimo.
              </Alert>
            )}
              </Card.Text>

              <Button variant="danger" onClick={liberarEspacio} className="mt-3">
                <i className="bi bi-trash"></i> Liberar Espacio
              </Button>
            </Card.Body>
          </Card>
        </>
      )}

      <Form onSubmit={handleModifySpaceAndCapacity} className="mb-3">
        <Form.Group controlId="formCapacity" className="mt-3">
          <Form.Label><i className="bi bi-hdd-stack-fill"></i> Modificar Capacidad Total (GB)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Capacidad total"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUsedSpace">
          <Form.Label><i className="bi bi-database-fill-up"></i> Modificar Espacio Utilizado (GB)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Espacio utilizado"
            value={usedSpace}
            onChange={(e) => setUsedSpace(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3">
          <i className="bi bi-save2-fill"></i> Actualizar Espacio y Capacidad
        </Button>
      </Form>

      <Form onSubmit={handleAdjustDemand}>
        <Form.Group controlId="formDemand">
          <Form.Label><i className="bi bi-arrow-up-right-circle"></i> Ajustar Demanda (GB)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingresa la demanda"
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          <i className="bi bi-graph-up-arrow"></i> Ajustar Demanda
        </Button>
      </Form>
    </Container>
  );
};

export default Almacenamiento;
