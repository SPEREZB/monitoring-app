import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const alertas = (titulo, mensaje, icon) => {
    MySwal.fire({
        title: titulo,
        text: mensaje,
        icon: icon,
        confirmButtonText: 'Aceptar',
      }); 
};

export default alertas;
