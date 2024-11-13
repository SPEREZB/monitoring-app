import React from 'react'; 
import sandclock from './../../assets/sandclock.gif' 
import './../../styles/storage.css'; 

const SandClockLoad =()=>
{ 
  return(
    <> 
        <div className="overlay">
        <div className="overlay-content-balanced">
          <img 
            src={sandclock} 
            alt="Balanceando..." 
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
          />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
            Cargando, por favor espera...
          </p>
        </div>
      </div>  
       </>
  );
};
export default SandClockLoad;