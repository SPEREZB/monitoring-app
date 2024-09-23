import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Codificador from './components/Codificador';
import Almacenamiento from './components/Almacenamiento';
import Mantenimiento from './components/Mantenimiento';  
import './App.css'; 


const CardItem = ({ title, iconClass, description, link, color }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="text-center card-hover" 
      style={{ backgroundColor: color, cursor: 'pointer' }}  
      onClick={() => navigate(link)}  
    >
      <Card.Body>
        <i className={iconClass} style={{ fontSize: '3rem' }}></i>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const App = () => {
  return (
    <Router>
      <Container className="mt-4"> 
        <Row>
        <Col md={4} className="mb-4">
          <CardItem 
            title="Monitoreo" 
            iconClass="bi bi-graph-up"  
            description="Accede al módulo de monitoreo."
            link="/mantenimiento"
            color="#f0ad4e"  
          />
        </Col>
        <Col md={4}>
          <CardItem 
            title="Almacenamiento" 
            iconClass="bi bi-server"  
            description="Accede al módulo de almacenamiento."
            link="/almacenamiento"
            color="#28a745"  
          />
        </Col>
        <Col md={4}>
          <CardItem 
            title="Reconstrucción" 
            iconClass="bi bi-tools"   
            description="Accede al módulo de reconstrucción."
            link="/codificador"
            color="#007bff" 
          />
        </Col>
        <Col md={4}>
          <CardItem 
            title="Resolver inconsistencias" 
            iconClass="bi bi-exclamation-triangle"  
            description="Accede al módulo de resolver inconsistencias."
            link="/resolver-inconsistencias"
            color="#dc3545"  
          />
        </Col>

        </Row>
 
        <Card className="p-4 shadow mt-4" style={{ borderRadius: '15px', borderColor: '#e0e0e0' }}>
              <Routes>
                <Route path="/mantenimiento" element={<Mantenimiento />} />
                <Route path="/almacenamiento" element={<Almacenamiento />} />
                <Route path="/codificador" element={<Codificador />} />
              </Routes>
            </Card>
      </Container>
    </Router>
  );
};

export default App;
