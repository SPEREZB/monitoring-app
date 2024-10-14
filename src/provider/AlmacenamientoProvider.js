import React, { useState } from 'react'; 

export const AlmacenamientoProvider = () => {
    const [usedSpace, setUsedSpace] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [balancing, setBalancing] = useState(false);
    const [trashConst, setTrash] = useState(false);
    const [reloadDiscos, setReloadDiscos] = useState(false);
    const [disk, setDisk] = useState([]);
    const [smartDevices, setSmartDevices] = useState([]);
    const [selectedDiskIndex, setSelectedDiskIndex] = useState(null);
    const [selectedDisk, setSelectedDisk] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [alertasMostradas, setAlertasMostradas] = useState([]);
    const [criticalThreshold, setCriticalThreshold] = useState(100);
    const [warningThreshold, setWarningThreshold] = useState(90);
    const [generalThreshold, setGeneralThreshold] = useState(80);
    const [rutaCache, setRutaCache] = useState('');

    const [storageInfo, setStorageInfo] = useState({
        capacity: 100,
        used_space: 40,
        available_space: 60,
      });

    const porcentajeUsado = (storageInfo.used_space / storageInfo.capacity) * 100;  
 

    return {
        usedSpace,
        setUsedSpace,
        capacity,
        setCapacity,
        error,
        setError,
        success,
        setSuccess,
        loading,
        setLoading,
        balancing,
        setBalancing,
        trashConst,
        setTrash,
        reloadDiscos,
        setReloadDiscos,
        disk,
        setDisk,
        smartDevices,
        setSmartDevices,
        selectedDiskIndex,
        setSelectedDiskIndex,
        selectedDisk,
        setSelectedDisk,
        isLoading,
        setIsLoading,
        alertasMostradas,
        setAlertasMostradas,
        criticalThreshold,
        setCriticalThreshold,
        warningThreshold,
        setWarningThreshold,
        generalThreshold,
        setGeneralThreshold,
        porcentajeUsado,
        setStorageInfo,
        rutaCache,
        setRutaCache,
    };
};
export default AlmacenamientoProvider;