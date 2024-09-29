import React, { useState } from 'react'; 
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Codificador from './components/Codificador';
import Almacenamiento from './components/Almacenamiento';
import Mantenimiento from './components/Mantenimiento';  
import './App.css'; 

const CardItem = ({ title, iconClass, description, link, color }) => {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState('white');

  const handleClick = () => {
    setBgColor('white'); 
    navigate(link);
  };

  return (
    <Card 
      className="text-center card-hover" 
      style={{ 
        border: `4px solid ${color}`, 
        cursor: 'pointer', 
        borderRadius: '10px', 
        backgroundColor: bgColor 
      }} 
      onClick={handleClick} 
    >
      <Card.Body>
        <i className={iconClass} style={{ fontSize: '3rem', color: color }}></i>
        <Card.Title style={{ color: color }}>{title}</Card.Title>
        <Card.Text style={{ color: color }}>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const App = () => {
  return (
    <Router>
<Container className="mt-4">
        <div className="scroll-container">
          <div className="card-column">
            <CardItem
              title="Monitoreo"
              iconClass="bi bi-graph-up"
              description="Monitorea en tiempo real tus discos."
              link="/mantenimiento" 
              color="#f0ad4e" 
            />
          </div>
          <div className="card-column">
            <CardItem
              title="Almacenamiento"
              iconClass="bi bi-server"
              description="Almacenamiento automatizado según se requiera."
              link="/almacenamiento"
              color="#28a745"
            />
          </div>
          <div className="card-column">
            <CardItem
              title="Reconstrucción"
              iconClass="bi bi-tools"
              description="Recuperación de datos ante fallos críticos."
              link="/codificador"
              color="#007bff"
            />
          </div>
          <div className="card-column">
            <CardItem
              title="Resolver inconsistencias"
              iconClass="bi bi-exclamation-triangle"
              description="Resolver inconsistencias en los datos."
              link="/resolver-inconsistencias"
              color="#dc3545"
            />
          </div>
        </div>
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
