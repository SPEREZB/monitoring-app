import { useNavigate } from "react-router-dom";

const useRouter =()=>
{
    const navigate= useNavigate();

    const handleModulos=(link)=>
    {
        navigate(link);
    }
    const handleReportes=()=>
    {
        navigate('reportes');
    }
    
 
    return { navigate, handleModulos, handleReportes};
};
export default useRouter; 