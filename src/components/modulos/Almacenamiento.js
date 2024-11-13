import React, { useEffect, useContext  } from 'react'; 
import Discos from "../complementos/Discos"; 
import AlmacenamientoProvider from '../../provider/AlmacenamientoProvider';
import { Container, Card, Button, Form, Alert, Row, Col, ProgressBar } from 'react-bootstrap'; 
import alertas from '../../utilities/alerts/alerts';
import 'bootstrap-icons/font/bootstrap-icons.css';  
import diskServices from "../../services/diskServices"
import formated from '../../utilities/formated/formated';
import BalancedLoad from '../statesLoad/BalancedLoad';
import TrashLoad from '../statesLoad/TrashLoad';
import useAlerts from '../../hooks/useAlerts';


const Almacenamiento = () => {
  const {
    usedSpace,
    setUsedSpace,
    capacity,
    setCapacity,
    error,
    setError,
    success,
    setSuccess,
    loading,
    reloadDiscos,
    setReloadDiscos,
    disk,
    setDisk,
    smartDevices,
    setSmartDevices,
    selectedDiskIndex,
    setSelectedDiskIndex,
    selectedDisk,
    setSelectedDisk,
    isLoading,
    setIsLoading, 
    criticalThreshold,
    setCriticalThreshold,
    warningThreshold,
    setWarningThreshold,
    generalThreshold,
    setGeneralThreshold,
    porcentajeUsado,
    setStorageInfo,
    rutaCache,
    setRutaCache, 
} = AlmacenamientoProvider();
 

  const {choose_disk, balancedDisk, liberarDisk, balancing, trashConst} = diskServices();
  const {convertToGB}= formated();

  const thresholds = { generalThreshold, warningThreshold, criticalThreshold };
  const { verificarAlertas, alertasMostradas, setAlertasMostradas } = useAlerts(disk, porcentajeUsado, selectedDisk, thresholds,convertToGB);
 
  const handleBalanceDisks = async () => {
    try {   
      const response = await balancedDisk(disk); 
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
    setSelectedDiskIndex(index); 
    setSelectedDisk(device);
    choose_disk(device);
  }; 

  const handleLiberar = async (ruta) => {
    if(rutaCache!="" && rutaCache!=undefined)
    {  
      const response = await liberarDisk(rutaCache); 

      alertas("Espacio liberado con éxito", "Se ha liberado: "+ response.data +" archivos", "success");
    }else
    {
      alertas("Debe escribir el nombre de usuario de su disco", "", "warning");
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

      <h1 className="text-center text-success">Gestión de Almacenamiento <i className="bi bi-hdd-stack"></i></h1> 
   
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
   <BalancedLoad />
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
                Umbral de advertencia media (%)
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
                Umbral de advertencia crítica (%)
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
                Umbral de advertencia leve (%)
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
       <TrashLoad />
      )}
    </Card>
      </Col>
    </Row>
    </Container>
  );
};

export default Almacenamiento;
