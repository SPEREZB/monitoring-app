import React, { useState } from "react";
import inconsistenciaService from "../services/inconsistenciaService";

export const InconsistenciaProvider = () => {
  const [datos, setDatos] = useState([]);
  const [datosParidad, setDatosParidad] = useState([]);
  const [ruta, setRuta] = useState("");
  const [rutaVerParidad, setRutaVerParidad] = useState("");  
  const [verificando, setVerificando] = useState(false); 
  const [analizando, setAnalizando] = useState(false);
  const [resolverConst, setResolverConst] = useState(false);
  const { analizarInconsistency, resolverInconsistency,analizarParidad } = inconsistenciaService();

  return {
    datos,
    setDatos,
    datosParidad, setDatosParidad,
    ruta,
    setRuta,
    rutaVerParidad,
    setRutaVerParidad,
    analizando,
    setAnalizando,
    verificando,
    setVerificando,
    analizarInconsistency,
    resolverInconsistency,
    analizarParidad,
    resolverConst,
    setResolverConst,
  };
};
export default InconsistenciaProvider;
