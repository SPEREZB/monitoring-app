import React from 'react'; 
import unlocked from './../../assets/unlocked.gif'
import './../../styles/storage.css';

const CodingLoad =()=>
{ 
  return(
    <> 
        <div className="overlay">
        <div className="overlay-content-balanced">
          <img 
            src={unlocked} 
            alt="Balanceando..." 
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
          />
          <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
            Fragmentando los datos de la ruta para su posterior recuperación, por favor espera...
          </p>
        </div>
      </div>  
       </>
  );
};
export default CodingLoad;