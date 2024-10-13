import axios from "axios";

const diskInterceptor =()=>
{
    const getDisks = async () => {
        const response = await axios.get("http://127.0.0.1:5000/api/get_devices");
    
        return response;
      };

      const choose_disk = async (diskEscogido) => { 
        await axios.post(
          "http://127.0.0.1:5000/api/choose_devices",
          { name: diskEscogido }
        ); 
      };
      const balancedDisk = async (disk) => { 
        const response = await axios.post('http://127.0.0.1:5000/api/data/balance', { disk });

        return response;
      }; 
      const liberarDisk = async (ruta) => { 
        try {
          const response = await axios.post('http://127.0.0.1:5000/api/data/liberar', { ruta });
          return response;
      } catch (error) {
          console.error("Error al liberar espacio:", error);  
          throw error; 
      }
      }; 

      const removeDisk = () => {
      
      };
      return { getDisks, choose_disk, balancedDisk, liberarDisk, removeDisk };
};
export default diskInterceptor;