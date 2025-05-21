import jsPDF from 'jspdf';
import { calcularFactura } from './calculadora';
import { formatCurrency, formatDate } from './formatters';

// Generador para Media Carta (ya existente)
export const generarPDFDirecto = (cliente, consumo, periodo) => {
  const factura = calcularFactura(cliente, consumo, periodo);
  
  // Crear PDF tamaño media carta
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [139.7, 215.9]
  });
  
  let y = 20; // Posición vertical inicial
  
  // Configurar fuente
  pdf.setFontSize(20);
  pdf.setTextColor(30, 64, 175); // Azul
  pdf.text('SEMAPA', 20, y);
  
  y += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Servicio Municipal de Agua Potable y Alcantarillado', 20, y);
  y += 5;
  pdf.text('NIT: 1020304050 - Cochabamba, Bolivia', 20, y);
  
  // Información de factura
  y += 12;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('FACTURA', 20, y);
  
  y += 7;
  pdf.setFontSize(10);
  pdf.text(`Nº: ${factura.numeroFactura}`, 20, y);
  y += 5;
  pdf.text(`Fecha: ${formatDate(new Date())}`, 20, y);
  y += 5;
  pdf.text(`Periodo: ${periodo}`, 20, y);
  
  // Total a pagar (caja)
  pdf.rect(90, y - 15, 40, 20);
  pdf.setFontSize(12);
  pdf.text('TOTAL A PAGAR', 95, y - 10);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text(formatCurrency(factura.total), 95, y - 3);
  pdf.setFont(undefined, 'normal');
  
  // Datos del cliente
  y += 12;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('DATOS DEL CLIENTE', 20, y);
  pdf.setFont(undefined, 'normal');
  
  y += 7;
  pdf.setFontSize(10);
  pdf.text(`Nombre: ${cliente.nombre} ${cliente.apellido}`, 20, y);
  y += 5;
  pdf.text(`CI: ${cliente.ci}`, 20, y);
  y += 5;
  pdf.text(`Contrato: ${cliente.numContrato}`, 20, y);
  y += 5;
  pdf.text(`Medidor: ${cliente.numMedidor}`, 20, y);
  y += 5;
  pdf.text(`Dirección: ${cliente.direccion}`, 20, y);
  y += 5;
  pdf.text(`Zona: ${cliente.zona}`, 20, y);
  y += 5;
  pdf.text(`Distrito: ${cliente.distrito}`, 20, y);
  y += 5;
  pdf.text(`Categoría: ${factura.nombreCategoria}`, 20, y);
  
  // Detalle de consumo (tabla simplificada)
  y += 12;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('DETALLES DE CONSUMO', 20, y);
  pdf.setFont(undefined, 'normal');
  
  y += 8;
  pdf.setFontSize(10);
  
  // Encabezados de tabla
  pdf.text('Descripción', 20, y);
  pdf.text('Cantidad', 60, y);
  pdf.text('Precio', 85, y);
  pdf.text('Subtotal', 110, y);
  
  pdf.line(20, y + 2, 130, y + 2); // Línea horizontal
  
  y += 7;
  pdf.text('Consumo de Agua', 20, y);
  pdf.text(`${consumo.consumo} m³`, 60, y);
  pdf.text(formatCurrency(factura.precioM3), 85, y);
  pdf.text(formatCurrency(factura.montoConsumo), 110, y);
  
  y += 5;
  pdf.text('Cargo Fijo', 20, y);
  pdf.text('1', 60, y);
  pdf.text(formatCurrency(factura.cargoFijo), 85, y);
  pdf.text(formatCurrency(factura.cargoFijo), 110, y);
  
  y += 5;
  pdf.text('Alcantarillado', 20, y);
  pdf.text('1', 60, y);
  pdf.text(formatCurrency(factura.montoAlcantarillado), 85, y);
  pdf.text(formatCurrency(factura.montoAlcantarillado), 110, y);
  
  pdf.line(20, y + 2, 130, y + 2); // Línea horizontal
  
  y += 7;
  pdf.setFont(undefined, 'bold');
  pdf.text('TOTAL', 20, y);
  pdf.text(formatCurrency(factura.total), 110, y);
  pdf.setFont(undefined, 'normal');
  
  // Código de pago con menos espacio
  y += 15;
  
  // Caja más compacta para el código
  const boxWidth = 90;
  const boxHeight = 22;
  const boxX = (139.7 - boxWidth) / 2;
  
  // Dibujar caja para el código
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  pdf.rect(boxX, y, boxWidth, boxHeight);
  
  pdf.setFontSize(9);
  pdf.text('Código de pago:', 139.7/2, y + 8, { align: 'center' });
  
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(12);
  pdf.text(factura.codigoPago, 139.7/2, y + 16, { align: 'center' });
  pdf.setFont(undefined, 'normal');
  
  // Pie de página
  y += 28;
  pdf.setFontSize(8);
  pdf.text('Esta factura es válida sin firma ni sello según Resolución Nº 10-0016-07', 139.7/2, y, { align: 'center' });
  pdf.text('Conserve este documento como constancia de pago', 139.7/2, y + 4, { align: 'center' });
  
  return pdf;
};

// NUEVO: Generador para Rollo Térmico
export const generarPDFRolloDirecto = (cliente, consumo, periodo) => {
  const factura = calcularFactura(cliente, consumo, periodo);
  
  // Crear PDF tamaño rollo térmico
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 150] // 80mm ancho, 150mm altura inicial
  });
  
  let y = 10; // Posición vertical inicial
  const centerX = 40; // Centro horizontal (80mm / 2)
  
  // Encabezado
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('SEMAPA', centerX, y, { align: 'center' });
  
  y += 6;
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.text('Serv. Municipal de Agua', centerX, y, { align: 'center' });
  y += 4;
  pdf.text('NIT: 1020304050', centerX, y, { align: 'center' });
  
  // Línea divisoria
  y += 4;
  pdf.setLineWidth(0.5);
  pdf.setLineDash([2, 2]);
  pdf.line(5, y, 75, y);
  pdf.setLineDash([]);
  
  // Información de factura
  y += 6;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text(`FACTURA Nº ${factura.numeroFactura}`, 5, y);
  
  y += 5;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(9);
  pdf.text(`Fecha: ${formatDate(new Date())}`, 5, y);
  y += 4;
  pdf.text(`Periodo: ${periodo}`, 5, y);
  
  // Datos del cliente
  y += 6;
  pdf.setFont(undefined, 'bold');
  pdf.text('CLIENTE:', 5, y);
  y += 4;
  pdf.setFont(undefined, 'normal');
  pdf.text(`${cliente.nombre} ${cliente.apellido}`, 5, y);
  y += 4;
  pdf.text(`CI: ${cliente.ci}`, 5, y);
  y += 4;
  pdf.text(`Contrato: ${cliente.numContrato}`, 5, y);
  y += 4;
  pdf.text(`Medidor: ${cliente.numMedidor}`, 5, y);
  y += 4;
  pdf.setFontSize(8);
  pdf.text(`${cliente.direccion}`, 5, y);
  y += 4;
  pdf.text(`${cliente.zona} - ${cliente.distrito}`, 5, y);
  
  // Línea divisoria
  y += 4;
  pdf.setLineWidth(0.5);
  pdf.setLineDash([2, 2]);
  pdf.line(5, y, 75, y);
  pdf.setLineDash([]);
  
  // Detalle de consumo
  y += 6;
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.text('DETALLE DE CONSUMO:', 5, y);
  
  y += 5;
  pdf.setFont(undefined, 'normal');
  
  // Items de consumo
  pdf.text('Consumo agua', 5, y);
  pdf.text(`${consumo.consumo} m³`, 60, y);
  
  y += 4;
  pdf.text('Precio/m³', 5, y);
  pdf.text(formatCurrency(factura.precioM3), 60, y);
  
  y += 4;
  pdf.text('Subtotal agua', 5, y);
  pdf.text(formatCurrency(factura.montoConsumo), 60, y);
  
  y += 4;
  pdf.text('Cargo fijo', 5, y);
  pdf.text(formatCurrency(factura.cargoFijo), 60, y);
  
  y += 4;
  pdf.text('Alcantarillado', 5, y);
  pdf.text(formatCurrency(factura.montoAlcantarillado), 60, y);
  
  // Línea doble para total
  y += 4;
  pdf.setLineWidth(0.5);
  pdf.line(5, y, 75, y);
  pdf.line(5, y + 1, 75, y + 1);
  
  // Total
  y += 7;
  pdf.setFontSize(10);
  pdf.text('TOTAL A PAGAR', centerX, y, { align: 'center' });
  y += 6;
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text(formatCurrency(factura.total), centerX, y, { align: 'center' });
  
  // Lecturas
  y += 8;
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Lectura Ant: ${factura.lecturaAnterior || 'N/A'}`, 5, y);
  y += 4;
  pdf.text(`Lectura Act: ${consumo.lectura}`, 5, y);
  y += 4;
  pdf.text(`Consumo: ${consumo.consumo} m³`, 5, y);
  
  // Código de pago
  y += 6;
  pdf.setFontSize(9);
  pdf.text('Código de pago:', centerX, y, { align: 'center' });
  y += 5;
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(11);
  pdf.text(factura.codigoPago, centerX, y, { align: 'center' });
  
  // Línea final
  y += 5;
  pdf.setFont(undefined, 'normal');
  pdf.setLineWidth(0.5);
  pdf.setLineDash([2, 2]);
  pdf.line(5, y, 75, y);
  pdf.setLineDash([]);
  
  // Mensaje final
  y += 5;
  pdf.setFontSize(8);
  pdf.text('Gracias por su pago puntual', centerX, y, { align: 'center' });
  y += 4;
  pdf.text('SEMAPA - Al servicio de', centerX, y, { align: 'center' });
  y += 4;
  pdf.text('Cochabamba', centerX, y, { align: 'center' });
  
  return pdf;
};