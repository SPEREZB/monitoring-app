import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container } from 'react-bootstrap';

const Error_Reports = () => { 
  const [errorAlerts, setAlerts] = useState([]);
  const [state, setState] = useState([]);

  const get_alerts_errors = async () => { 

    const response = await axios.get(
      "http://127.0.0.1:5000/api/report_alerts"
    );
      
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
    check_identified_errors();
  }, []); 


  return (
    <Container>
    <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#dc3545' }}>
      Todos las alertas críticas del disco registradas
    </h2>
  
    {/* Verifica que ambos arrays tengan el mismo tamaño para evitar errores */}
    {errorAlerts.length === 0 || state.length === 0 ? (
      <p className="text-muted text-center" style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>
        No se han registrado errores.
      </p>
    ) : (
      errorAlerts.map((alert, index) => (
        <div key={index} className="d-flex mb-3">
          {/* Primer Card - Información del error */}
          <Card
            className="shadow-sm me-3"
            style={{
              flex: 1,
              borderLeft: "8px solid #dc3545",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
              cursor: "pointer",
              backgroundColor: "#fff3f3",
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
  
          {/* Segundo Card - Estado del error (Identificado / No Identificado) */}
          <Card
            className="shadow-sm"
            style={{
              width: "150px",
              borderRadius: "12px",
              backgroundColor: state[index]?.detectado ? "#d4edda" : "#f8d7da", // Fondo dependiendo del estado detectado
              borderLeft: `8px solid ${state[index]?.detectado ? "#28a745" : "#dc3545"}`, // Bordes en verde o rojo
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card.Body className="d-flex align-items-center justify-content-center">
              <i
                className={state[index]?.detectado ? "bi bi-check-circle-fill" : "bi bi-x-circle-fill"}
                style={{ fontSize: '2rem', color: state[index]?.detectado ? "#28a745" : "#dc3545" }}
              ></i>
              <span className="ms-2 fw-bold" style={{ fontSize: '1.2rem', color: '#333' }}>
                {state[index]?.detectado ? "Identificado" : "No Identificado"}
              </span>
            </Card.Body>
          </Card>
        </div>
      ))
    )}
  </Container>
  

  );
};

export default Error_Reports;
