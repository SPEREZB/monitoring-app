import axios from "axios";
import {API_URL} from "../utilities/API";

const reportsInterceptor =()=>
{
    const get_alerts_errors = async () => { 

        const response = await axios.get(
          API_URL+"/report_alerts"
        );
        return response;
          
       
      };
      return { get_alerts_errors };
};
export default reportsInterceptor;