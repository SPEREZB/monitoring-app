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
            const data = response.data;
 
            return Object.entries(data).map(([nombre, estado], index) => ({
              id: index + 1,
              nombre,
              fecha: new Date().toLocaleDateString(), 
              estado: 
                estado === 'Archivo válido.' ? 'Valido' :
                estado === 'Es una carpeta' ? 'Carpeta' :
                estado === 'No es un archivo válido.' ? 'Inconsistente' :
                estado === 'El archivo está vacío.' ? 'Inconsistente' : estado,
            }));
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
    return {getInconsistency, analizarInconsistency, resolverInconsistency};
};
export default useInconsistenciaService;