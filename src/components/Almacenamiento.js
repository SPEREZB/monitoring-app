import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const Almacenamiento = () => {
  const [datos, setDatos] = useState('');
  const [id, setId] = useState('');
  const [resultadoRecuperado, setResultadoRecuperado] = useState('');

  const handleAlmacenar = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/almacenar', { datos });
      alert('Datos almacenados correctamente');
    } catch (error) {
      console.error('Error al almacenar datos:', error);
    }
  };

  const handleRecuperar = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/recuperar/${id}`);
      setResultadoRecuperado(response.data.dato_recuperado);
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Almacenamiento de Datos</h1>
          <Form>
            <Form.Group controlId="formDatosAlmacenamiento">
              <Form.Label>Datos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa los datos a almacenar"
                value={datos}
                onChange={(e) => setDatos(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAlmacenar} className="mt-3">
              Almacenar
            </Button>
          </Form>
          <Form className="mt-4">
            <Form.Group controlId="formIdRecuperar">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingresa el ID a recuperar"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleRecuperar} className="mt-3">
              Recuperar
            </Button>
          </Form>
          {resultadoRecuperado && (
            <div className="mt-3">
              <h5>Datos Recuperados:</h5>
              <p>{resultadoRecuperado}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Almacenamiento;
