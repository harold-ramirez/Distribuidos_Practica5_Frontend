import { tarifas, alcantarillado } from '../data/tarifas';

export const calcularFactura = (cliente, consumo, periodo) => {
  const tarifa = tarifas[cliente.categoria];
  const tarifaAlcantarillado = alcantarillado[cliente.categoria];
  
  // Cálculos básicos
  const montoConsumo = consumo.consumo * tarifa.precioM3;
  const total = montoConsumo + tarifa.cargoFijo + tarifaAlcantarillado;
  
  // Generar número de factura único
  const numeroFactura = `${periodo.replace('-', '')}-${cliente.numContrato.split('-')[1]}`;
  
  // Generar código de pago
  const codigoPago = `${numeroFactura}-${Math.floor(Math.random() * 10000)}`;
  
  return {
    numeroFactura,
    codigoPago,
    nombreCategoria: tarifa.nombre,
    categoria: cliente.categoria,
    precioM3: tarifa.precioM3,
    cargoFijo: tarifa.cargoFijo,
    montoConsumo,
    montoAlcantarillado: tarifaAlcantarillado,
    total,
    lecturaAnterior: consumo.lectura - consumo.consumo,
    lecturaActual: consumo.lectura,
    consumo: consumo.consumo
  };
};