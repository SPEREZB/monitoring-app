import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container } from 'react-bootstrap';
import reportsInterceptor from "../../interceptors/reportsInterceptor";

const Error_Reports = () => { 
  const [errorAlerts, setAlerts] = useState([]);
  const [state, setState] = useState([]);
  const { get_alerts_errors} = reportsInterceptor();

  const handleAlertsErrors = async () => { 
    const response= await get_alerts_errors(); 
    setAlerts(response.data.alerts);
  };
  
  const check_identified_errors = async () => { 

    const response = await axios.get(
      "http://127.0.0.1:5000/api/identified_alerts"
    );
      
    setState(response.data.state);
  };

  useEffect(() => {
    get_alerts_errors();
   // check_identified_errors();
  }, []); 


  return (
    <Container>
    <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#dc3545' }}>
    Reporte de estados criticos obtenidos por SMART
    </h2>

    {errorAlerts.length === 0 ? (
      <p className="text-muted text-center" style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>
        No se han registrado errores.
      </p>
    ) : (
      errorAlerts.map((alert, index) => (
        <Card
          key={index}
          className="mb-3 shadow-sm"
          style={{
            borderLeft: "8px solid #dc3545",
            borderRadius: "12px",
            transition: "transform 0.3s ease",
            cursor: "pointer",
            backgroundColor: "#fff3f3", // Fondo suave
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Card.Body className="d-flex align-items-center justify-content-between">
            <div>
              <Card.Title className="mb-0 d-flex align-items-center">
                <i
                  className="bi bi-exclamation-triangle-fill me-3"
                  style={{ fontSize: '2rem', color: '#dc3545' }} 
                ></i>
                <span className="fw-bold" style={{ fontSize: '1.2rem', color: '#333' }}>
                  {alert}
                </span>
              </Card.Title>
            </div>
            <small className="text-danger" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              ¡Atención necesaria!
            </small>
          </Card.Body>
        </Card>
      ))
    )}
  </Container>

  );
};

export default Error_Reports;
