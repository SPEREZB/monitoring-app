import React, { useState } from 'react'; 
import reconstructionService from "../services/reconstructionService";

export const ReconstruccionProvider = () => {
    const [rutaCodificar, setRutaCodificar] = useState('');
    const [rutaDecodificar, setRutaDecodificar] = useState('');
    const [resultadoCodificado, setResultadoCodificado] = useState('');
    const [resultadoDecodificado, setResultadoDecodificado] = useState(''); 
    const [rutasGuardadas, setRutasGuardadas] = useState(''); 
    const { encode_disk, decode_disk, get_subdirectories } = reconstructionService(); 
 

    return {
        rutaCodificar,
        setRutaCodificar,
        rutaDecodificar,
        setRutaDecodificar,
        resultadoCodificado,
        setResultadoCodificado,
        resultadoDecodificado,
        setResultadoDecodificado,
        rutasGuardadas, 
        setRutasGuardadas,
        encode_disk,
        decode_disk,
        get_subdirectories
    };
};
export default ReconstruccionProvider;