import { useState, useCallback } from 'react';
import { clientes, consumos } from '../data/mockData';
import { calcularFactura } from '../utils/calculadora';

export const useFactura = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const buscarCliente = useCallback((tipoIdentificador, identificador) => {
    setError(null);
    let cliente = null;
    
    switch(tipoIdentificador) {
      case 'contrato':
        cliente = clientes.find(c => c.numContrato === identificador);
        break;
      case 'ci':
        cliente = clientes.find(c => c.ci === identificador);
        break;
      case 'medidor':
        cliente = clientes.find(c => c.numMedidor === identificador);
        break;
      default:
        setError('Tipo de identificador no válido');
    }
    
    if (!cliente) {
      setError('Cliente no encontrado');
    }
    
    return cliente;
  }, []);
  
  const obtenerConsumo = useCallback((numMedidor, periodo) => {
    const consumosMedidor = consumos[numMedidor];
    if (!consumosMedidor) {
      setError('No hay datos de consumo para este medidor');
      return null;
    }
    
    const consumo = consumosMedidor.find(c => c.periodo === periodo);
    if (!consumo) {
      setError('No hay datos de consumo para este periodo');
      return null;
    }
    
    return consumo;
  }, []);
  
  const generarFactura = useCallback(async (cliente, periodo) => {
    setLoading(true);
    setError(null);
    
    try {
      const consumo = obtenerConsumo(cliente.numMedidor, periodo);
      if (!consumo) {
        throw new Error('No se pudo obtener el consumo');
      }
      
      const datosFactura = calcularFactura(cliente, consumo, periodo);
      
      setLoading(false);
      return {
        cliente,
        consumo,
        periodo,
        factura: datosFactura
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [obtenerConsumo]);
  
  return {
    buscarCliente,
    obtenerConsumo,
    generarFactura,
    loading,
    error
  };
};