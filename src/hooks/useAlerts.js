import { useState, useEffect } from 'react';
import alertas from '../utilities/alerts/alerts'; 

const useAlerts = (disk, porcentajeUsado, selectedDisk, thresholds, convertToGB) => {
    const [alertasMostradas, setAlertasMostradas] = useState([]);
    const { generalThreshold, warningThreshold, criticalThreshold } = thresholds;

    const verificarAlertas = () => {
        disk.forEach((discos) => {
            const sizeNum = convertToGB(discos.size);
            const usedNum = convertToGB(discos.used);
    
            const porcentajeUtilizado = (usedNum / sizeNum) * 100;
    
            if (porcentajeUtilizado > warningThreshold && !alertasMostradas.includes(discos.filesystem)) {
                alertas(`¡Advertencia! Disco ${discos.filesystem}`, `El disco está utilizando el ${porcentajeUtilizado.toFixed(2)}% del espacio. ¡Considera liberar espacio!`, "warning");
                setAlertasMostradas((prevAlertas) => [...prevAlertas, discos.filesystem]);
            }
        });
    
        if (porcentajeUsado > generalThreshold && !alertasMostradas.includes("basica")) {
            alertas("¡Alerta básica!", `El almacenamiento supera el ${generalThreshold}%. ¡Considera añadir otro disco!`, "info");
            setAlertasMostradas((prevAlertas) => [...prevAlertas, "basica"]);
        }
    
        if (porcentajeUsado > criticalThreshold && !alertasMostradas.includes("fallo")) {
            alertas("¡Peligro de fallo en el disco!", `El uso del disco está al ${criticalThreshold}%. Esto podría malograr el disco. ¡Libera espacio de inmediato!`, "error");
            setAlertasMostradas((prevAlertas) => [...prevAlertas, "fallo"]);
        }
    
        if (selectedDisk && porcentajeUsado > criticalThreshold && !alertasMostradas.includes("fallo en cierto disco")) {
            alertas(`Disco ${selectedDisk} al límite`, "El disco seleccionado está casi lleno. ¡Considera retirarlo antes de dañarlo!", "error");
            setAlertasMostradas((prevAlertas) => [...prevAlertas, "fallo en cierto disco"]);
        }
    };

    return { verificarAlertas, alertasMostradas, setAlertasMostradas };
};

export default useAlerts;
