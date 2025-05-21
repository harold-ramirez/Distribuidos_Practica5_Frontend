export const categorias = [
  { codigo: 'R1', nombre: 'Doméstico - Sin servicio', descripcion: 'Lotes con acometida hasta la rasante' },
  { codigo: 'R2', nombre: 'Doméstico - Precario', descripcion: 'Casas precarias' },
  { codigo: 'R3', nombre: 'Doméstico - Económico', descripcion: 'Casas con servicios de construcción económica' },
  { codigo: 'R4', nombre: 'Doméstico - Confortable', descripcion: 'Casa confortable con servicios' },
  { codigo: 'C', nombre: 'Comercial', descripcion: 'Actividad comercial' },
  { codigo: 'CE', nombre: 'Comercial Especial', descripcion: 'Utilizan agua como insumo' },
  { codigo: 'I', nombre: 'Industrial', descripcion: 'Talleres mecánicos, fábricas, panaderías' },
  { codigo: 'M', nombre: 'Mixto', descripcion: 'Vivienda con actividad comercial' },
  { codigo: 'P', nombre: 'Preferencial', descripcion: 'Instituciones del Estado' },
  { codigo: 'S', nombre: 'Social', descripcion: 'Uso social' }
];

export const obtenerDescripcionCategoria = (codigo) => {
  const categoria = categorias.find(cat => cat.codigo === codigo);
  return categoria ? categoria.descripcion : 'Sin descripción';
};