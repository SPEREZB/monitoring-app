import React from 'react'; 
import key from './../../assets/key.gif' 
import './../../styles/storage.css'; 

const DecodingLoad =()=>
{ 
  return(
    <> 
        <div className="overlay">
        <div className="overlay-content-balanced">
          <img 
            src={key} 
            alt="Balanceando..." 
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
          />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
          Reconstruyendo los datos de la ruta, por favor espera...
          </p>
        </div>
      </div>  
       </>
  );
};
export default DecodingLoad;