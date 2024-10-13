import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Discos from "../complementos/Discos"; 
import { Container, Card, Button, Form, Alert, Row, Col, ProgressBar, Spinner } from 'react-bootstrap'; 
import alertas from '../../utilities/alerts/alerts';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import balanza from './../../assets/balanza.gif' 
import trash from './../../assets/trash.gif' 
import diskInterceptor from '../../interceptors/diskInterceptor';
import formated from '../../utilities/formated/formated';


const Almacenamiento = () => {
  const [storageInfo, setStorageInfo] = useState({
    capacity: 100,
    used_space: 40,
    available_space: 60,
  });
  const [usedSpace, setUsedSpace] = useState('');
  const [capacity, setCapacity] = useState(''); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balancing, setBalancing] = useState(false); 
  const [trashConst, setTrash] = useState(false); 
  const [reloadDiscos, setReloadDiscos] = useState(false);  
  const [disk, setDisk] = useState([]);
  const [smartDevices, setSmartDevices] = useState([]); 
  const [selectedDiskIndex, setSelectedDiskIndex] = useState(null);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const porcentajeUsado = (storageInfo.used_space / storageInfo.capacity) * 100; 
  const [alertasMostradas, setAlertasMostradas] = useState([]); 
  const [criticalThreshold, setCriticalThreshold] = useState(100); 
  const [warningThreshold, setWarningThreshold] = useState(90);   
  const [generalThreshold, setGeneralThreshold] = useState(80); 
  const [rutaCache, setRutaCache] = useState('');

  const {choose_disk, balancedDisk, liberarDisk} = diskInterceptor();
  const {convertToGB}= formated();

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
      const response = await balancedDisk(disk);
      setBalancing(false); 
      setReloadDiscos(prevState => !prevState);
      const data = response.data;
      
      if (data.status === 'Balance completado') {
        setDisk(data.disks);  
        alertas("¡Discos Balanceados Correctamente!", "", "success");
        setReloadDiscos((prev) => !prev); 
        setSuccess('Discos balanceados correctamente.');
        setError(null);
      } else {
        setError('Error al balancear discos');
      }
      verificarAlertas();
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
    setSelectedDisk(device);
    choose_disk(device);
  }; 

  const handleLiberar = async (ruta) => {
    if(rutaCache!="" && rutaCache!=undefined)
    {

    
      setTrash(true);
      const response = await liberarDisk(rutaCache); 

      setTimeout(() => {
        setTrash(false);
        alertas("Espacio liberado con éxito", "Se ha liberado: "+ response.data +" archivos", "success");
      }, 4000);
    }
  }; 



  let diskIndex;
  let hasShownCriticalAlert = false;
   

  
  const verificarAlertas = () => {
    disk.forEach((discos, index) => {
      const sizeNum = convertToGB(discos.size);
      const usedNum = convertToGB(discos.used);
  
      const porcentajeUtilizado = (usedNum / sizeNum) * 100;
  
      if (porcentajeUtilizado > warningThreshold && !alertasMostradas.includes(discos.filesystem)) {
        alertas(`¡Advertencia! Disco ${discos.filesystem}`, `El disco está utilizando el ${porcentajeUtilizado.toFixed(2)}% del espacio. ¡Considera liberar espacio!`, "warning");
        setAlertasMostradas((prevAlertas) => [...prevAlertas, discos.filesystem]);
      }
    });
  
    if (porcentajeUsado > generalThreshold && !alertasMostradas.includes("basica")) {
      alertas("¡Alerta basica!", `El almacenamiento supera el ${generalThreshold}%. ¡Considera añadir otro disco!`, "info");
      setAlertasMostradas((prevAlertas) => [...prevAlertas, "basica"]);
    }
  
    if (porcentajeUsado > criticalThreshold && !alertasMostradas.includes("fallo")) {
      alertas("¡Peligro de fallo en el disco!", `El uso del disco está al ${criticalThreshold}%. Esto podría malograr el disco. ¡Libera espacio de inmediato!`, "error");
      setAlertasMostradas((prevAlertas) => [...prevAlertas, "fallo"]);
    }
  
    if (selectedDisk && porcentajeUsado > criticalThreshold && !alertasMostradas.includes("fallo en cierto disco")) {
      alertas(`Disco ${selectedDisk} al límite`, "El disco seleccionado está casi lleno. ¡Considera retirarlo antes de dañarlo!", "error");
      setAlertasMostradas((prevAlertas) => [...prevAlertas, "fallo en cierto disco"]);
    }
  }; 

  const handleModifyThresholds = (e) => {
    e.preventDefault();
    setWarningThreshold(parseInt(warningThreshold));
    setCriticalThreshold(parseInt(criticalThreshold));
    setGeneralThreshold(parseInt(generalThreshold));
    setSuccess("Umbrales actualizados correctamente.");
    verificarAlertas();
  };
  

  useEffect(() => {
    fetchStorageInfo();
  }, []);
   
  useEffect(() => {
    const interval = setInterval(() => {
      verificarAlertas();
      setReloadDiscos(prevState => !prevState);
    }, 5000); 
  
    return () => clearInterval(interval);  
  }, [porcentajeUsado, selectedDisk, disk,alertasMostradas]); 

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
 
 {disk.length === 0 ? ( 
  <Card className="mb-4 shadow-lg">
    <Card.Body>
      <Row className="text-center mb-4">
        <Col>
          <i className="bi bi-hdd-network" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
          <Card.Title>Información de Almacenamiento "Simulación de un disco real"</Card.Title>
        </Col>
      </Row>
      <Col>
        <p>No es a cargado información.</p>
      </Col>
    </Card.Body>
  </Card>
) : (
  <Card className="mb-4 shadow-lg">
    <Card.Body>
    <Row className="text-center mb-4">
  <Col>
    <i className="bi bi-hdd-network" style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
    <Card.Title>Información de Almacenamiento del Todos los Discos</Card.Title>
  </Col>
</Row> 
<Row>
  <Col>
    <Card.Text>
      <i className="bi bi-hdd" style={{ marginRight: '10px' }}></i>
      <strong>Capacidad Total:</strong> {disk.reduce((total, d) => total + (parseFloat(d.size) || 0), 0).toFixed(2)} GB
    </Card.Text>
  </Col>
  <Col>
    <Card.Text>
      <i className="bi bi-cloud-upload-fill" style={{ marginRight: '10px' }}></i>
      <strong>Espacio Utilizado:</strong> {(
        disk.reduce((total, d) => {
          const usedInGB = (parseFloat(d.used) || 0) / (d.used.includes('MB') ? 1024 : 1);  
          return total + usedInGB;
        }, 0)
      ).toFixed(2)} GB
    </Card.Text>
  </Col>
  <Col>
    <Card.Text>
      <i className="bi bi-hdd-fill" style={{ marginRight: '10px' }}></i>
      <strong>Espacio Disponible:</strong> {(
        disk.reduce((total, d) => total + (parseFloat(d.size) || 0), 0) - 
        disk.reduce((total, d) => {
          const usedInGB = (parseFloat(d.used) || 0) / (d.used.includes('MB') ? 1024 : 1);
          return total + usedInGB;
        }, 0)
      ).toFixed(2)} GB
    </Card.Text>
  </Col>
</Row>
<ProgressBar
  now={(() => {
    const totalUsed = disk.reduce((total, d) => {
      const usedInGB = (parseFloat(d.used) || 0) / (d.used.includes('MB') ? 1024 : 1);
      return total + usedInGB;
    }, 0);
    const totalSize = disk.reduce((total, d) => total + (parseFloat(d.size) || 0), 0);
    return totalSize > 0 ? (totalUsed / totalSize) * 100 : 0;  
  })()}
  label={`${(() => {
    const totalUsed = disk.reduce((total, d) => {
      const usedInGB = (parseFloat(d.used) || 0) / (d.used.includes('MB') ? 1024 : 1);
      return total + usedInGB;
    }, 0);
    const totalSize = disk.reduce((total, d) => total + (parseFloat(d.size) || 0), 0);
    return totalSize > 0 ? `${((totalUsed / totalSize) * 100).toFixed(2)}% usado` : '0% usado';  
  })()}`}
  variant={(() => {
    const totalUsed = disk.reduce((total, d) => {
      const usedInGB = (parseFloat(d.used) || 0) / (d.used.includes('MB') ? 1024 : 1);
      return total + usedInGB;
    }, 0);
    const totalSize = disk.reduce((total, d) => total + (parseFloat(d.size) || 0), 0);
    return totalSize > 0 && (totalUsed / totalSize) * 100 > 80 ? 'danger' : 'success';  
  })()}
  className="mb-3"
/>


    </Card.Body>
  </Card>
)}

<Card className="mb-4 shadow-lg">

  
<div className="container mt-4"> 
      <Form onSubmit={handleModifyThresholds}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="warningThreshold">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                Umbral de advertencia (%)
              </Form.Label>
              <Form.Control
                type="number"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(e.target.value)}
                placeholder="Ej: 75"
                required
                className="form-control"
              />
              <Form.Text className="text-muted">
                Establezca el porcentaje que activa una advertencia.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="criticalThreshold">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                Umbral crítico (%)
              </Form.Label>
              <Form.Control
                type="number"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(e.target.value)}
                placeholder="Ej: 90"
                required
                className="form-control"
              />
              <Form.Text className="text-muted">
                Establezca el porcentaje que activa una alerta crítica.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="generalThreshold">
              <Form.Label className="d-flex align-items-center">
                <i className="bi bi-circle-fill text-info me-2"></i>
                Umbral basico (%)
              </Form.Label>
              <Form.Control
                type="number"
                value={generalThreshold}
                onChange={(e) => setGeneralThreshold(e.target.value)}
                placeholder="Ej: 100"
                required
                className="form-control"
              />
              <Form.Text className="text-muted">
                Establezca el porcentaje general para los límites.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row> 
        <Button variant="primary" type="submit" className="mt-3 mb-3">Guardar Umbrales</Button>
      </Form>
    </div>
    </Card>
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
              min="0"  
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
              min="0" 
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
 
      <Col xs={12} md={6}>
      <Card className="mb-4 shadow-lg">
      <Card.Body>
  <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label htmlFor="rutaCache">Usuario:</label>
        <input
          type="text"
          id="rutaCache"
          className="form-control"
          value={rutaCache}
          onChange={(e) => setRutaCache(e.target.value)}
          placeholder="Ingrese cual es su usuario en su PC/LAPTOP"
          required
        />
      </div>
    </div>
    <div className="col-md-5">
      <div className="d-flex flex-column align-items-center"> 
      <Button className="mt-3" variant="danger" onClick={handleLiberar}>
  <div className="d-flex align-items-center">
    <i className="bi bi-trash fs-1"></i> 
    <span>Liberar Espacio</span>
  </div>
</Button>
      </div>
    </div>
  </div>
</Card.Body>
 
      {trashConst && (
        <div className="overlay">
          <div className="overlay-content-balanced">
            <img 
              src={trash} 
              alt="Balanceando..." 
              style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
            />
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
              Liberando espacio de disco, por favor espera...
            </p>
          </div>
        </div>
      )}
    </Card>
      </Col>
    </Row>
    </Container>
  );
};

export default Almacenamiento;
