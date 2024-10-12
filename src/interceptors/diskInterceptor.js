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

      const removeDisk = () => {
      
      };
      return { getDisks, choose_disk, removeDisk };
};
export default diskInterceptor;