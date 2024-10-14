import React, { useState } from 'react'; 
import useRouter from '../hooks/useRouter'; 

export const MantenimientoProvider = () => {
    const [alerts, setAlerts] = useState([]);
    const [definitions, setDefinitions] = useState([]);
    const [disk, setDisk] = useState([]);
    const [smartDevices, setSmartDevices] = useState([]);
    const [selectedDisk, setSelectedDisk] = useState(null);
    const [selectedDiskIndex, setSelectedDiskIndex] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);  
    const [diskUsagePercent, setDiskUsagePercent] = useState(0);
    const [diskErrors, setDiskErrors] = useState(0);
    const [tasaDeteccion, setTasaDeteccion] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [showModal, setShowModal] = useState(false); 
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);   
    const {navigate} = useRouter();
 

    return {
        alerts,
        setAlerts,
        definitions,
        setDefinitions,
        disk,
        setDisk,
        smartDevices,
        setSmartDevices,
        selectedDisk,
        setSelectedDisk,
        selectedDiskIndex,
        setSelectedDiskIndex,
        showOverlay,
        setShowOverlay,
        diskUsagePercent,
        setDiskUsagePercent,
        diskErrors,
        setDiskErrors,
        tasaDeteccion,
        setTasaDeteccion,
        isLoading,
        setIsLoading,
        isError,
        setIsError,
        showModal,
        handleShowModal,
        handleCloseModal,
        navigate,
    };
};

export default MantenimientoProvider;