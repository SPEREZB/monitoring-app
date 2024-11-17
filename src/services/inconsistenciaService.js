import {API_URL} from "../utilities/API"


const useInconsistenciaService =()=>
{  
    const getInconsistency = async () => {
        try { 
            const response = await API_URL.get("/inconsistencias");
            return response.data;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    const analizarInconsistency = async (folder) => {
        try { 
            const response = await API_URL.post("/analizar", {folder});
            return response.data; 
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    const analizarParidad = async (folder) => {
        try { 
            const response = await API_URL.post("/get_parity_for_name", {folder});
            return response.data; 
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    const resolverInconsistency = async (folder) => {
        try {  
            const response = await API_URL.post("/resolver", {folder});
            return response;  
        } catch (error) {
            console.error('Error al obtener discos:', error);
            throw error;  
        }
    };
    return {getInconsistency, analizarInconsistency, analizarParidad, resolverInconsistency};
};
export default useInconsistenciaService;