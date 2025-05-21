import React from 'react';
import { calcularFactura } from '../../utils/calculadora';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FacturaMediaCartaPDF = ({ cliente, consumo, periodo }) => {
  const factura = calcularFactura(cliente, consumo, periodo);
  
  // Estilos inline simples para evitar problemas con html2canvas
  const styles = {
    container: {
      width: '139.7mm',
      height: '215.9mm',
      backgroundColor: '#ffffff',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#000000'
    },
    header: {
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '5px'
    },
    subtitle: {
      fontSize: '12px',
      color: '#666666'
    },
    section: {
      marginBottom: '20px'
    },
    grid: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    totalBox: {
      border: '2px solid #000000',
      padding: '10px',
      textAlign: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      borderBottom: '2px solid #333333',
      padding: '8px',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    td: {
      borderBottom: '1px solid #cccccc',
      padding: '8px'
    },
    footer: {
      textAlign: 'center',
      fontSize: '10px',
      color: '#666666',
      marginTop: '20px'
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>SEMAPA</h1>
        <p style={styles.subtitle}>Servicio Municipal de Agua Potable y Alcantarillado</p>
        <p style={styles.subtitle}>NIT: 1020304050 - Cochabamba, Bolivia</p>
      </div>

      {/* Información de Factura */}
      <div style={styles.grid}>
        <div>
          <h2 style={{fontSize: '18px', fontWeight: 'bold'}}>FACTURA</h2>
          <p style={{fontSize: '14px'}}>Nº: {factura.numeroFactura}</p>
          <p style={{fontSize: '14px'}}>Fecha: {formatDate(new Date())}</p>
          <p style={{fontSize: '14px'}}>Periodo: {periodo}</p>
        </div>
        <div style={styles.totalBox}>
          <p style={{fontWeight: 'bold', fontSize: '16px'}}>TOTAL A PAGAR</p>
          <p style={{fontSize: '24px', fontWeight: 'bold'}}>{formatCurrency(factura.total)}</p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div style={styles.section}>
        <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>DATOS DEL CLIENTE</h3>
        <div style={{fontSize: '14px'}}>
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
      <div style={styles.section}>
        <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>DETALLES DE CONSUMO</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Descripción</th>
              <th style={{...styles.th, textAlign: 'center'}}>Cantidad</th>
              <th style={{...styles.th, textAlign: 'center'}}>Precio</th>
              <th style={{...styles.th, textAlign: 'right'}}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Consumo de Agua</td>
              <td style={{...styles.td, textAlign: 'center'}}>{consumo.consumo} m³</td>
              <td style={{...styles.td, textAlign: 'center'}}>{formatCurrency(factura.precioM3)}</td>
              <td style={{...styles.td, textAlign: 'right'}}>{formatCurrency(factura.montoConsumo)}</td>
            </tr>
            <tr>
              <td style={styles.td}>Cargo Fijo</td>
              <td style={{...styles.td, textAlign: 'center'}}>1</td>
              <td style={{...styles.td, textAlign: 'center'}}>{formatCurrency(factura.cargoFijo)}</td>
              <td style={{...styles.td, textAlign: 'right'}}>{formatCurrency(factura.cargoFijo)}</td>
            </tr>
            <tr>
              <td style={styles.td}>Alcantarillado</td>
              <td style={{...styles.td, textAlign: 'center'}}>1</td>
              <td style={{...styles.td, textAlign: 'center'}}>{formatCurrency(factura.montoAlcantarillado)}</td>
              <td style={{...styles.td, textAlign: 'right'}}>{formatCurrency(factura.montoAlcantarillado)}</td>
            </tr>
            <tr style={{fontWeight: 'bold'}}>
              <td style={{...styles.td, borderBottom: 'none'}} colSpan="3">TOTAL</td>
              <td style={{...styles.td, textAlign: 'right', borderBottom: 'none'}}>{formatCurrency(factura.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Código de pago */}
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <div style={{
          display: 'inline-block',
          padding: '10px',
          border: '2px dashed #666666'
        }}>
          <p style={{fontSize: '12px'}}>Código de pago</p>
          <p style={{fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace'}}>{factura.codigoPago}</p>
        </div>
      </div>

      {/* Pie de página */}
      <div style={styles.footer}>
        <p>Esta factura es válida sin firma ni sello según Resolución Nº 10-0016-07</p>
        <p>Conserve este documento como constancia de pago</p>
      </div>
    </div>
  );
};

export default FacturaMediaCartaPDF;