// Formatear moneda (Bolivianos)
export const formatCurrency = (amount) => {
  return `Bs ${amount.toFixed(2)}`;
};

// Formatear fecha
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-BO', options);
};

// Formatear fecha corta
export const formatShortDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };
  return date.toLocaleDateString('es-BO', options);
};

// Formatear periodo (2025-05 -> Mayo 2025)
export const formatPeriodo = (periodo) => {
  const [year, month] = periodo.split('-');
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${meses[parseInt(month) - 1]} ${year}`;
};

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-BO').format(number);
};

// Formatear CI (Carnet de Identidad)
export const formatCI = (ci) => {
  // Asumiendo formato: 1234567-1A
  if (ci.length > 7) {
    return `${ci.slice(0, 7)}-${ci.slice(7)}`;
  }
  return ci;
};