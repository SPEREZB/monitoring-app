import React, { useState } from "react";
import inconsistenciaService from "../services/inconsistenciaService";

export const InconsistenciaProvider = () => {
  const [datos, setDatos] = useState([]);
  const [ruta, setRuta] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [resolverConst, setResolverConst] = useState(false);
  const { analizarInconsistency, resolverInconsistency } = inconsistenciaService();

  return {
    datos,
    setDatos,
    ruta,
    setRuta,
    analizando,
    setAnalizando,
    analizarInconsistency,
    resolverInconsistency,
    resolverConst,
    setResolverConst,
  };
};
export default InconsistenciaProvider;
