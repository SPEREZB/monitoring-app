import axios from "axios"; 
import alertas from "../utilities/alerts/alerts";
import AlmacenamientoProvider from "../provider/AlmacenamientoProvider"; 

const useDiskInterceptor =()=>
{
  const {  
    balancing, 
    trashConst,
    setLoading, 
    setBalancing, 
    setTrash, 
} = AlmacenamientoProvider();

      const diskInstance = axios.create({
        baseURL: 'http://127.0.0.1:5000/api', 
    });

      diskInstance.interceptors.request.use(
      (config) => { 
          console.log('Solicitud enviada a:', config.url);
          return config; 
      },
      (error) => {
          // Manejo de errores en la solicitud
          console.error('Error en la solicitud:', error);
          return Promise.reject(error);
      }
      );  
   
      diskInstance.interceptors.response.use(
          (response) => { 
              return response; 
          },
          async (error) => {
            const message = error.response ? error.response.data.message : 'Error de red, se volvera a intentar la conexión'; 
            alertas("Error", message, "error");
            const originalRequest = error.config;
            if (error.response.status === 500 && !originalRequest._retry) {
                originalRequest._retry = true;
                await new Promise((resolve) => setTimeout(resolve, 1000));  
                return diskInstance(originalRequest);  
            }
            return Promise.reject(error);
        }
      );


        const getDisks = async () => {
          try {
              const response = await diskInstance.get("/get_devices");
              return response;  
          } catch (error) {
              console.error('Error al obtener discos:', error);
              throw error;  
          }
      };
 
      const choose_disk = async (diskEscogido) => { 
          try {
              setLoading(true);
              await diskInstance.post("/choose_devices", { name: diskEscogido });
              setLoading(false);
          } catch (error) {
              console.error('Error al elegir disco:', error);
              throw error;  
          }
      };
 
      const balancedDisk = async (disk) => { 
          try {
              setBalancing(true); 
              const response = await diskInstance.post('/data/balance', { disk }); 
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
              const response = await diskInstance.post('/data/liberar', { ruta }); 
              setTrash(false);
              return response;
          } catch (error) {
              console.error("Error al liberar espacio:", error);  
              throw error; 
          }
      }; 
 
      const removeDisk = async (disk)  => { 
        try { 
            const response = await diskInstance.post('/removeDisk', { disk });  
            return response;
        } catch (error) {
            console.error("Error al liberar espacio:", error);  
            throw error; 
        }
      };

      return { getDisks, choose_disk, balancedDisk, liberarDisk, balancing, trashConst, removeDisk };
};
export default useDiskInterceptor;