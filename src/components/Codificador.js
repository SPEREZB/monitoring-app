// src/components/Codificador.js

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const Codificador = () => {
  const [datos, setDatos] = useState('');
  const [resultadoCodificado, setResultadoCodificado] = useState('');
  const [resultadoDecodificado, setResultadoDecodificado] = useState('');

  const handleCodificar = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/codificar', { datos });
      setResultadoCodificado(response.data.datos_codificados);
    } catch (error) {
      console.error('Error al codificar:', error);
    }
  };

  const handleDecodificar = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/decodificar', { datos: resultadoCodificado });
      setResultadoDecodificado(response.data.datos_decodificados);
    } catch (error) {
      console.error('Error al decodificar:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Codificación y Decodificación</h1>
          <Form>
            <Form.Group controlId="formDatos">
              <Form.Label>Datos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa los datos a codificar"
                value={datos}
                onChange={(e) => setDatos(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCodificar} className="mt-3">
              Codificar
            </Button>
            <Button variant="secondary" onClick={handleDecodificar} className="mt-3 ms-2">
              Decodificar
            </Button>
          </Form>
          {resultadoCodificado && (
            <div className="mt-3">
              <h5>Datos Codificados:</h5>
              <p>{resultadoCodificado}</p>
            </div>
          )}
          {resultadoDecodificado && (
            <div className="mt-3">
              <h5>Datos Decodificados:</h5>
              <p>{resultadoDecodificado}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Codificador;
