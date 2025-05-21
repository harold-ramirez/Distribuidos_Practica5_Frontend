import React from 'react';
import { calcularFactura } from '../../utils/calculadora';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FacturaRolloTermico = ({ cliente, consumo, periodo }) => {
  const factura = calcularFactura(cliente, consumo, periodo);
  
  return (
    <div 
      className="factura-rollo bg-white p-4" 
      id="factura-rollo"
      style={{
        width: '80mm',
        minHeight: '150mm',
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000'
      }}
    >
      {/* Encabezado compacto */}
      <div className="text-center mb-3">
        <h1 className="text-lg font-bold">SEMAPA</h1>
        <p className="text-xs">Serv. Municipal de Agua</p>
        <p className="text-xs">NIT: 1020304050</p>
      </div>

      {/* Línea divisoria */}
      <div className="border-b border-dashed border-gray-600 mb-2"></div>

      {/* Información de factura */}
      <div className="text-sm mb-2">
        <p className="font-bold">FACTURA Nº {factura.numeroFactura}</p>
        <p>Fecha: {formatDate(new Date())}</p>
        <p>Periodo: {periodo}</p>
      </div>

      {/* Datos del cliente */}
      <div className="text-sm mb-2">
        <p className="font-bold">CLIENTE:</p>
        <p>{cliente.nombre} {cliente.apellido}</p>
        <p>CI: {cliente.ci}</p>
        <p>Contrato: {cliente.numContrato}</p>
        <p>Medidor: {cliente.numMedidor}</p>
        <p className="text-xs">{cliente.direccion}</p>
        <p className="text-xs">{cliente.zona} - {cliente.distrito}</p>
      </div>

      {/* Línea divisoria */}
      <div className="border-b border-dashed border-gray-600 mb-2"></div>

      {/* Detalles de consumo simplificado */}
      <div className="text-sm mb-2">
        <p className="font-bold">DETALLE DE CONSUMO:</p>
        <div className="flex justify-between">
          <span>Consumo agua</span>
          <span>{consumo.consumo} m³</span>
        </div>
        <div className="flex justify-between">
          <span>Precio/m³</span>
          <span>{formatCurrency(factura.precioM3)}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal agua</span>
          <span>{formatCurrency(factura.montoConsumo)}</span>
        </div>
        <div className="flex justify-between">
          <span>Cargo fijo</span>
          <span>{formatCurrency(factura.cargoFijo)}</span>
        </div>
        <div className="flex justify-between">
          <span>Alcantarillado</span>
          <span>{formatCurrency(factura.montoAlcantarillado)}</span>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-b-2 border-double border-gray-800 mb-2"></div>

      {/* Total */}
      <div className="text-center mb-3">
        <p className="text-xs">TOTAL A PAGAR</p>
        <p className="text-xl font-bold">{formatCurrency(factura.total)}</p>
      </div>

      {/* Lecturas */}
      <div className="text-xs mb-3">
        <p>Lectura Ant: {factura.lecturaAnterior || 'N/A'}</p>
        <p>Lectura Act: {consumo.lectura}</p>
        <p>Consumo: {consumo.consumo} m³</p>
      </div>

      {/* Código de pago */}
      <div className="text-center mb-2">
        <p className="text-xs">Código de pago:</p>
        <p className="font-mono font-bold text-sm">{factura.codigoPago}</p>
      </div>

      {/* Línea divisoria final */}
      <div className="border-b border-dashed border-gray-600 mb-2"></div>

      {/* Mensaje final */}
      <div className="text-center text-xs">
        <p>Gracias por su pago puntual</p>
        <p>SEMAPA - Al servicio de</p>
        <p>Cochabamba</p>
      </div>
    </div>
  );
};

export default FacturaRolloTermico;