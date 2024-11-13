import React from 'react'; 
import repair from './../../assets/repair.gif' 
import './../../styles/storage.css'; 

const RepairLoad =()=>
{ 
  return(
    <> 
        <div className="overlay">
        <div className="overlay-content-balanced">
          <img 
            src={repair} 
            alt="Balanceando..." 
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
          />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
            Resolviendo inconsistencias, por favor espera...
          </p>
        </div>
      </div>  
       </>
  );
};
export default RepairLoad;