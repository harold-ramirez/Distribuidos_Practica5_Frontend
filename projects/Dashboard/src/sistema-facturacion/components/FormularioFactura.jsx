import React, { useState } from 'react';
import { clientes } from '../data/mockData';

const FormularioFactura = ({ onGenerarFactura }) => {
  const [tipoIdentificador, setTipoIdentificador] = useState('contrato');
  const [identificador, setIdentificador] = useState('');
  const [periodo, setPeriodo] = useState('2025-05');
  const [formato, setFormato] = useState('pdf_media_carta');

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    }

    if (cliente) {
      onGenerarFactura({
        cliente,
        periodo,
        formato
      });
    } else {
      alert('Cliente no encontrado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="card-title">Generar Factura</h2>
      
      <div className="form-group">
        <label className="form-label">
          Tipo de Identificador
        </label>
        <select
          value={tipoIdentificador}
          onChange={(e) => setTipoIdentificador(e.target.value)}
          className="form-select"
        >
          <option value="contrato">Número de Contrato</option>
          <option value="ci">Carnet de Identidad</option>
          <option value="medidor">Número de Medidor</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          Identificador
        </label>
        <input
          type="text"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          className="form-input"
          placeholder={
            tipoIdentificador === 'contrato' ? 'Ej: 2024-001234' :
            tipoIdentificador === 'ci' ? 'Ej: 7654321' :
            'Ej: MED-120001'
          }
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Periodo
        </label>
        <input
          type="month"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Formato
        </label>
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          className="form-select"
        >
          <option value="pdf_media_carta">PDF Media Carta</option>
          <option value="pdf_rollo">PDF Rollo Térmico</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
      >
        Generar Factura
      </button>
      
      <div className="alert alert-info" style={{ marginTop: '1rem' }}>
        <strong>Tip:</strong> Prueba con los contratos: 2024-001234 o 2024-001235
      </div>
    </form>
  );
};

export default FormularioFactura;