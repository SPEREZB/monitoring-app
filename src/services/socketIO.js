import io from "socket.io-client";
 
import Swal from 'sweetalert2'; // Para las alertas de MySwal

const socket = io("http://127.0.0.1:5000"); 

export const socketIO = (index, setAlerts, setDefinitions, setDiskUsagePercent, setDiskErrors, setIsLoading, setIsError, handleNewAlert) => {
    socket.on("connect", () => {
        console.log("Conectado al servidor Socket.IO");
    });

    socket.on("new_alert", (newAlerts) => {
        try {
            if (!newAlerts || !newAlerts.disk || newAlerts.disk.length === 0) {
                throw new Error("El disco ha sufrido un error o ha sido retirado");
            }

            if (index === 0) {
                if (newAlerts.alerts[0].includes("Raw_Read_Error_Rate")) {
                    setIsError(false);
                    console.log("Nuevas alertas recibidas:", newAlerts);
                    const filteredAlerts = newAlerts.alerts.filter(
                        (alert) => !alert.includes("Unknown_Attribute")
                    );
                    setAlerts(filteredAlerts);
                    setDefinitions(newAlerts.definitions);
                    handleNewAlert(newAlerts.alerts, newAlerts.definitions);
                    setDiskUsagePercent(newAlerts.disk[0]);
                    setDiskErrors(newAlerts.disk[1]);
                    setIsLoading(false);
                }
            } else {
                if (newAlerts.alerts[0].includes("Generic: User Capacity")) {
                    setIsError(false);
                    console.log("Nuevas alertas recibidas:", newAlerts);
                    const filteredAlerts = newAlerts.alerts.filter(
                        (alert) => !alert.includes("Unknown_Attribute")
                    );
                    setAlerts(filteredAlerts);
                    setDefinitions(newAlerts.definitions);
                    handleNewAlert(newAlerts.alerts, newAlerts.definitions);
                    setDiskUsagePercent(newAlerts.disk[0]);
                    setDiskErrors(newAlerts.disk[1]);
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.error(error.message);
            Swal.fire({
                title: "Error de Disco",
                text: "El disco ha sufrido un error o ha sido retirado.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
            setIsError(true);
            setIsLoading(false);
        }
    });

    return () => {
        socket.off("new_alert");
    };
};
