import React from 'react';
import { calcularFactura } from '../../utils/calculadora';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FacturaMediaCarta = ({ cliente, consumo, periodo }) => {
  const factura = calcularFactura(cliente, consumo, periodo);
  
  return (
    <div className="factura-container" style={{ width: '139.7mm', minHeight: '215.9mm' }}>
      {/* Encabezado */}
      <div className="factura-header">
        <h1 className="factura-logo">SEMAPA</h1>
        <p className="factura-subtitle">
          Servicio Municipal de Agua Potable y Alcantarillado
        </p>
        <p className="factura-subtitle">
          NIT: 1020304050 - Cochabamba, Bolivia
        </p>
      </div>

      {/* Información de Factura */}
      <div className="factura-info">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>FACTURA</h2>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            <strong>Nº:</strong> {factura.numeroFactura}
          </p>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            <strong>Fecha:</strong> {formatDate(new Date())}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            <strong>Periodo:</strong> {periodo}
          </p>
        </div>
        <div className="factura-total-box">
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            TOTAL A PAGAR
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
            {formatCurrency(factura.total)}
          </p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="factura-section">
        <h3 className="factura-section-title">DATOS DEL CLIENTE</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
          <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellido}</p>
          <p><strong>CI:</strong> {cliente.ci}</p>
          <p><strong>Contrato:</strong> {cliente.numContrato}</p>
          <p><strong>Medidor:</strong> {cliente.numMedidor}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Zona:</strong> {cliente.zona}</p>
          <p><strong>Distrito:</strong> {cliente.distrito}</p>
          <p><strong>Categoría:</strong> {factura.nombreCategoria}</p>
        </div>
      </div>

      {/* Detalles de Consumo */}
      <div className="factura-section">
        <h3 className="factura-section-title">DETALLES DE CONSUMO</h3>
        <table className="factura-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th style={{ textAlign: 'center' }}>Cantidad</th>
              <th style={{ textAlign: 'center' }}>Precio</th>
              <th style={{ textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consumo de Agua</td>
              <td style={{ textAlign: 'center' }}>{consumo.consumo} m³</td>
              <td style={{ textAlign: 'center' }}>{formatCurrency(factura.precioM3)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(factura.montoConsumo)}</td>
            </tr>
            <tr>
              <td>Cargo Fijo</td>
              <td style={{ textAlign: 'center' }}>1</td>
              <td style={{ textAlign: 'center' }}>{formatCurrency(factura.cargoFijo)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(factura.cargoFijo)}</td>
            </tr>
            <tr>
              <td>Alcantarillado</td>
              <td style={{ textAlign: 'center' }}>1</td>
              <td style={{ textAlign: 'center' }}>{formatCurrency(factura.montoAlcantarillado)}</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(factura.montoAlcantarillado)}</td>
            </tr>
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f3f4f6' }}>
              <td colSpan="3">TOTAL</td>
              <td style={{ textAlign: 'right' }}>{formatCurrency(factura.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lecturas */}
      <div className="factura-section" style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
        <h3 className="factura-section-title" style={{ borderColor: '#3b82f6' }}>HISTORIAL DE LECTURAS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lectura Anterior</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{factura.lecturaAnterior || 'N/A'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lectura Actual</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{consumo.lectura}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Consumo (m³)</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>{consumo.consumo}</p>
          </div>
        </div>
      </div>

      {/* Código QR o Código de Barras (simulado) */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <div style={{
          display: 'inline-block',
          padding: '1rem',
          border: '2px dashed #6b7280',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Código de pago</p>
          <p style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 'bold' }}>{factura.codigoPago}</p>
          <div style={{
            marginTop: '0.5rem',
            height: '3rem',
            width: '12rem',
            backgroundColor: '#000',
            backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px)',
            margin: '0 auto'
          }}></div>
        </div>
      </div>

      {/* Pie de página */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
        <p>Esta factura es válida sin firma ni sello según Resolución Nº 10-0016-07</p>
        <p>Conserve este documento como constancia de pago</p>
      </div>
    </div>
  );
};

export default FacturaMediaCarta;