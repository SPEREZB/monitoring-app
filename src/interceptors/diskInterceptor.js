import axios from "axios"; 
import alertas from "../utilities/alerts/alerts";
import AlmacenamientoProvider from "../provider/AlmacenamientoProvider"; 

const useDiskInterceptor =()=>
{ 

      const diskInstance = axios.create({
        baseURL: 'http://127.0.0.1:5000/api', 
    });

      diskInstance.interceptors.request.use(
      (config) => { 
          console.log('Solicitud enviada a:', config.url);
          return config; 
      },
      (error) => { 
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
};
export default useDiskInterceptor;