import React, { useState } from 'react';
import FormularioFactura from './components/FormularioFactura';
import FacturaMediaCarta from './components/facturas/FacturaMediaCarta';
import FacturaRolloTermico from './components/facturas/FacturaRolloTermico';
import { descargarPDF } from './utils/generadorPDF';
import { generarPDFDirecto, generarPDFRolloDirecto } from './utils/generadorPDFDirecto';
import { consumos } from './data/mockData';
import './App.css';

export default function SistemaFacturacionApp() {
  const [facturaActual, setFacturaActual] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleGenerarFactura = async (datos) => {
    const { cliente, periodo, formato } = datos;
    
    const consumosPeriodo = consumos[cliente.numMedidor];
    const consumo = consumosPeriodo.find(c => c.periodo === periodo);
    
    if (!consumo) {
      alert('No hay datos de consumo para este periodo');
      return;
    }
    
    setFacturaActual({
      cliente,
      consumo,
      periodo,
      formato
    });
    
    setVistaPrevia(true);
  };

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true);
    
    try {
      let pdf;
      const filename = `factura-${facturaActual.cliente.numContrato}-${facturaActual.periodo}.pdf`;
      
      if (facturaActual.formato === 'pdf_media_carta') {
        console.log('Generando PDF Media Carta con método directo...');
        pdf = generarPDFDirecto(facturaActual.cliente, facturaActual.consumo, facturaActual.periodo);
      } else {
        console.log('Generando PDF Rollo con método directo...');
        pdf = generarPDFRolloDirecto(facturaActual.cliente, facturaActual.consumo, facturaActual.periodo);
      }
      
      console.log('PDF generado, descargando...');
      descargarPDF(pdf, filename);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="main-title">
          <span style={{ color: '#3b82f6' }}>Sistema de Facturación</span>
          <br />
          <span style={{ fontSize: '2rem' }}>SEMAPA</span>
        </h1>
        
        <div className="main-grid">
          <div className="fade-in">
            <FormularioFactura onGenerarFactura={handleGenerarFactura} />
          </div>
          
          <div className="fade-in" style={{ animationDelay: '0.1s' }}>
            {vistaPrevia && facturaActual && (
              <div className="card">
                <div className="preview-header">
                  <h2 className="card-title" style={{ margin: 0 }}>Vista Previa</h2>
                  <button
                    onClick={handleDescargarPDF}
                    disabled={generandoPDF}
                    className={`btn ${generandoPDF ? 'btn-success' : 'btn-success'}`}
                  >
                    {generandoPDF && <span className="spinner"></span>}
                    {generandoPDF ? 'Generando PDF...' : 'Descargar PDF'}
                  </button>
                </div>
                
                <div className="preview-container">
                  {facturaActual.formato === 'pdf_media_carta' ? (
                    <FacturaMediaCarta
                      cliente={facturaActual.cliente}
                      consumo={facturaActual.consumo}
                      periodo={facturaActual.periodo}
                    />
                  ) : (
                    <FacturaRolloTermico
                      cliente={facturaActual.cliente}
                      consumo={facturaActual.consumo}
                      periodo={facturaActual.periodo}
                    />
                  )}
                </div>
              </div>
            )}
            
            {!vistaPrevia && (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1rem' }}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ color: '#6b7280', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sin Vista Previa</h3>
                <p style={{ color: '#9ca3af' }}>Genera una factura para ver la vista previa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
