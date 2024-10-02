import React from 'react';
import { Card, Container } from 'react-bootstrap';

const Error_Reports = ({ alerts }) => {
  const errorAlerts = alerts.filter(alert => alert.includes('Estado: Crítico'));

  return (
    <Container>
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#dc3545' }}>
      Todos los Errores Críticos registrados hasta ahora
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
