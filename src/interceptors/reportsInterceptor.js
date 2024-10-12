import axios from "axios";

const reportsInterceptor =()=>
{
    const get_alerts_errors = async () => { 

        const response = await axios.get(
          "http://127.0.0.1:5000/api/report_alerts"
        );
        return response;
          
       
      };
      return { get_alerts_errors };
};
export default reportsInterceptor;