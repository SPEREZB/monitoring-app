import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import React, { useEffect } from "react"; 

const Discos = ({
    disk, 
    smartDevices,  
    setDisk,
    setSmartDevices,
    setIsLoading,
    selectedDiskIndex, 
    handleDiskSelection,
}) => {
   
    function formatBytes(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 Bytes";
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
      }

useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/get_devices"
        );
        const formattedDevices = response.data.devices.map((device) => ({
          ...device,
          size: formatBytes(device.size),
          used: formatBytes(device.used),
        }));

        setDisk(formattedDevices);
        disk=formattedDevices;
        setSmartDevices(response.data.smartctl_devices);
        setIsLoading(true);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

    return (
        <>
             <Row>
        <Col>
          <h1 className="text-center">Seleccionar Disco</h1>
        </Col>
      </Row> 
      <Row className="mt-4">
        {disk.length === 0 ? (
          <Col>
            <p>No hay discos disponibles.</p>
          </Col>
        ) : (
          disk.map((diskItem, index) => (
            <Col md={4} key={index}>
             <Card
  className={`mb-3 shadow-lg border-0 ${
    selectedDiskIndex === index ? "selected-card" : ""
  }`}
  onClick={() => handleDiskSelection(index, smartDevices[index])}
  style={{
    cursor: "pointer",
    backgroundColor: selectedDiskIndex === index ? "#e6f7e6" : "#ffffff",
    boxShadow:
      selectedDiskIndex === index
        ? "0 0 15px rgba(0, 128, 0, 0.3)"
        : "0 0 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    borderRadius: "10px",
    padding: "20px",
    transform: selectedDiskIndex === index ? "scale(1.05)" : "scale(1)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 128, 0, 0.4)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow =
      selectedDiskIndex === index
        ? "0 0 15px rgba(0, 128, 0, 0.3)"
        : "0 0 10px rgba(0, 0, 0, 0.1)";
  }}
>
  <Card.Body>
    <Card.Title
      className="text-center"
      style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#333",
      }}
    >
      <i
        className={`bi ${
          parseFloat(diskItem.size) > 100 ? "bi-hdd-fill" : "bi-usb-plug"
        } me-2`}
        style={{
          color: parseFloat(diskItem.size) > 100 ? "#28a745" : "#007bff",
          fontSize: "1.8rem",
        }}
      ></i>
      {diskItem.filesystem}
    </Card.Title>
    <Card.Text className="text-center" style={{ color: "#555" }}>
      <i className="bi bi-database-fill me-1"></i> Tamaño:{" "}
      <span style={{ fontWeight: "bold" }}>{diskItem.size}</span>
    </Card.Text>
    <Card.Text className="text-center" style={{ color: "#888" }}>
      <i className="bi bi-bar-chart-fill me-1"></i> Utilizado:{" "}
      <span style={{ fontWeight: "bold", color: "#ff6347" }}>
        {diskItem.used}
      </span>
    </Card.Text>
    {selectedDiskIndex === index && (
      <div
        className="text-center"
        style={{
          color: "#28a745",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        <i className="bi bi-check-circle-fill me-2"></i> Seleccionado
      </div>
    )}
  </Card.Body>
</Card>

            </Col>
          ))
        )}
      </Row> 
        </>
    );
};

export default Discos;
