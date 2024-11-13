import {API_URL} from "../utilities/API"


const useReconstructionService =()=>
{  
    const encode_disk = async (folder) => {
        try { 
            const response = await API_URL.post("/encode_disk", {folder});
            return response.data;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    const decode_disk = async (folder) => {
        try {  
            const response = await API_URL.post("/decode_disk", {folder});
            return response.data;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    const get_subdirectories = async () => {
        try {  
            const response = await API_URL.get("/get_subdirectories");
            return response.data;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    return {encode_disk, decode_disk,get_subdirectories};
};
export default useReconstructionService;