import React from 'react'; 
import balanza from './../../assets/balanza.gif' 
import './../../styles/storage.css'; 

const BalancedLoad =()=>
{ 
  return(
    <> 
        <div className="overlay">
        <div className="overlay-content-balanced">
          <img 
            src={balanza} 
            alt="Balanceando..." 
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
          />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
            Ajustando el espacio entre los discos, por favor espera...
          </p>
        </div>
      </div>  
       </>
  );
};
export default BalancedLoad;