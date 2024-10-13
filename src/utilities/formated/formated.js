const format =()=>
{
    const formatBytes=( bytes) =>{
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 Bytes";
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
      };
    
      
      const convertToGB = (value) => { 
          if (value.includes('GB')) {
          return parseFloat(value) * 1;  
        } 
        else if (value.includes('MB')) {
          return parseFloat(value) / 1024;  
        } 
        return 0;  
    };
    return { formatBytes,convertToGB };
};
export default format; 