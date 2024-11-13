import {API_URL} from "../utilities/API"

import AlmacenamientoProvider from "../provider/AlmacenamientoProvider"; 

const useDiskService =()=>
{  
    const {  
        balancing, 
        trashConst,
        setLoading, 
        setBalancing, 
        setTrash, 
    } = AlmacenamientoProvider();
 

    const getDisks = async () => {
        try {
            const response = await API_URL.get("/get_devices");
            return response;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };

    const choose_disk = async (diskEscogido) => { 
        try {
            setLoading(true);
            await API_URL.post("/choose_devices", { name: diskEscogido });
            setLoading(false);
        } catch (error) {
            console.error('Error al elegir disco:', error);
            throw error;  
        }
    };

    const balancedDisk = async (disk) => { 
        try {
            setBalancing(true); 
            const response = await API_URL.post('/data/balance', { disk }); 
            setBalancing(false);
            return response;
        } catch (error) {
            console.error('Error al balancear disco:', error);
            throw error;
        }
    };  
    const liberarDisk = async (ruta) => { 
        try {
            setTrash(true); 
            const response = await API_URL.post('/data/liberar', { ruta }); 
            setTrash(false);
            return response;
        } catch (error) {
            console.error("Error al liberar espacio:", error);  
            throw error; 
        }
    }; 

    const removeDisk = async (disk)  => { 
    try { 
        const response = await API_URL.post('/removeDisk', { disk });  
        return response;
    } catch (error) {
        console.error("Error al liberar espacio:", error);  
        throw error; 
    }
    };
    return { getDisks, choose_disk, balancedDisk, liberarDisk, balancing, trashConst, removeDisk };
};
export default useDiskService;