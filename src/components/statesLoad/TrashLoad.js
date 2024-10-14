import React from 'react'; 
import trash from './../../assets/trash.gif';
import './../../styles/storage.css';

const TrashLoad = () => {
    return (
        <> 
                <div className="overlay">
                    <div className="overlay-content-balanced">
                        <img 
                            src={trash} 
                            alt="Balanceando..." 
                            style={{ width: '100%', maxWidth: '150px', height: 'auto' }} 
                        />
                        <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555' }}>
                            Liberando espacio de disco, por favor espera...
                        </p>
                    </div>
                </div> 
        </>
    );
};

export default TrashLoad;
