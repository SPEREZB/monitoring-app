import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import reconstructionService from "../../services/reconstructionService"; 
import ReconstruccionProvider from "../../provider/ReconstruccionProvider";
import CodingLoad from '../statesLoad/CodingLoad';
import DecodingLoad from '../statesLoad/DecodingLoad';
import alertas from "../../utilities/alerts/alerts";

const Reconstruccion = () => {   
  const {
    rutaCodificar,
    setRutaCodificar,
    rutaDecodificar,
    setRutaDecodificar,
    resultadoCodificado,
    setResultadoCodificado,
    resultadoDecodificado,
    setResultadoDecodificado,
    rutasGuardadas,
    setRutasGuardadas,
    encode_disk,
    decode_disk,
    get_subdirectories
  } = ReconstruccionProvider();

  const [codingConst, setCoding] = useState(false);
  const [decodingConst, setDecoding] = useState(false);

  const handleCodificar = async () => {
    if (rutaCodificar) {
      try {
        setCoding(true);
  
        const result = await encode_disk(rutaCodificar);
        setCoding(false);
        setResultadoCodificado(
          `Ruta de archivos fragmentados: ${result.ruta}. \n Numero total de archivos fragmentados: ${result.blocks_encoded}`
        );
        handleGetSubdirectories();
        alertas("Exito", "Fragmentación exitosa.", "success");
      } catch (error) {
        console.error("Error al codificar:", error);
      }
    } else {
      alertas(
        "Advertencia",
        "Por favor, ingresa una ruta para fragmentar.",
        "warning"
      );
    }
  };

 const handleDecodificar = async () => {
    if (rutaDecodificar) {
        try {
            setDecoding(true);
            const result = await decode_disk(rutaDecodificar);
            setDecoding(false);
            const archivosDecodificados = Object.entries(result.decoded_files)
            .map(([nombreArchivo, ruta]) => `${nombreArchivo}: ${ruta}`)
            .join("\n");
            setResultadoDecodificado(
                `Ruta de los archivos reconstruidos: ${result.decoded_files}`
            );
            alertas("Éxito", "Recuperación exitosa.", "success");
        } catch (error) {
            console.error("Error al decodificar:", error);
        }
    } else {
        alertas(
            "Advertencia",
            "Por favor, ingresa una ruta para reconstruir.",
            "warning"
        );
    }
};

  const handleGetSubdirectories= async ()=>{
     
    setRutasGuardadas(await get_subdirectories());
  }

  useEffect(() => {
    handleGetSubdirectories();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
        <h1 className="text-center text-primary mb-5">
      <i className="bi bi-arrow-repeat me-2"></i>
      Módulo de Reconstrucción de Datos
    </h1>
    <Row className="justify-content-center text-center">
      <Col md={5} className="mb-4">
        <Form.Group controlId="rutaCodificar">
          <Form.Label className="text-success fw-bold" style={{ fontSize: "1.2rem" }}>
            Ruta para Fragmentar
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text style={{ backgroundColor: "#e0f7ef" }}>
              <i className="bi bi-folder-fill text-success"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Ingresa la ruta de la carpeta para fragmentar"
              value={rutaCodificar}
              onChange={(e) => setRutaCodificar(e.target.value)}
              style={{
                borderRadius: "0 8px 8px 0",
                border: "1px solid #28a745",
                boxShadow: "0px 2px 5px rgba(40, 167, 69, 0.2)"
              }}
            />
          </InputGroup>
        </Form.Group>
        <Button
          variant="success"
          onClick={handleCodificar}
          className="w-100 py-2 d-flex align-items-center justify-content-center"
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.3)",
          }}
        >
    <i className="bi bi-grid-fill me-2"></i> Fragmentar

        </Button>
      </Col>
      
      <Col md={5}>
        <Form.Group controlId="rutaDecodificar">
          <Form.Label className="text-warning fw-bold" style={{ fontSize: "1.2rem" }}>
            Ruta para Reconstruir
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text style={{ backgroundColor: "#fff3cd" }}>
              <i className="bi bi-folder-fill text-warning"></i>
            </InputGroup.Text>
            <Form.Control
                as="select"
                value={rutaDecodificar}
                onChange={(e) => setRutaDecodificar(e.target.value)}
                style={{
                  borderRadius: "0 8px 8px 0",
                  border: "1px solid #28a745",
                  boxShadow: "0px 2px 5px rgba(40, 167, 69, 0.2)"
                }}
              >
                <option value="">Selecciona una ruta</option>
                {rutasGuardadas && rutasGuardadas.length > 0 && 
                rutasGuardadas.map((ruta, index) => (
                  <option key={index} value={ruta}>
                    {ruta}
                  </option>
                ))
              }
              </Form.Control>
          </InputGroup>
        </Form.Group>
        <Button
          variant="warning"
          onClick={handleDecodificar}
          className="w-100 py-2 d-flex align-items-center justify-content-center"
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(255, 193, 7, 0.3)",
          }}
        >
       <i className="bi bi-arrow-repeat me-2"></i> Reconstruir

        </Button>
      </Col>
    </Row>

          
          {decodingConst && ( 
       <DecodingLoad />
      )}
          {codingConst && ( 
       <CodingLoad />
      )}

{resultadoCodificado && (
    <div className="mt-4 p-4 rounded shadow-lg" style={{
        backgroundColor: "#e8f8f5",
        borderLeft: "5px solid #1abc9c",
        color: "#16a085"
    }}>
        <h5 className="d-flex align-items-center mb-3" style={{
            fontWeight: "bold", fontSize: "1.25rem"
        }}>
            <i className="bi bi-shield-lock-fill me-2"></i> Datos fragmentados
        </h5>
        <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            margin: 0
        }}>{resultadoCodificado}</p>
    </div>
)}

{resultadoDecodificado && (
    <div className="mt-4 p-4 rounded shadow-lg" style={{
        backgroundColor: "#fcf3cf",
        borderLeft: "5px solid #f39c12",
        color: "#d68910"
    }}>
        <h5 className="d-flex align-items-center mb-3" style={{
            fontWeight: "bold", fontSize: "1.25rem"
        }}>
            <i className="bi bi-unlock-fill me-2"></i> Reconstrucción exitosa
        </h5>
        <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            margin: 0
        }}>{resultadoDecodificado}</p>
    </div>
)}
        </Col>
      </Row>
    </Container>
  );
};

export default Reconstruccion;
