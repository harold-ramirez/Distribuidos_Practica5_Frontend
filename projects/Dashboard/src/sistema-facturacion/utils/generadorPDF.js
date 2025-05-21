import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generarPDFMediaCarta = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error('Elemento no encontrado:', elementId);
      throw new Error('Elemento de factura no encontrado');
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [139.7, 215.9]
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    return pdf;
  } catch (error) {
    console.error('Error generando PDF media carta:', error);
    throw error;
  }
};

export const generarPDFRollo = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error('Elemento no encontrado:', elementId);
      throw new Error('Elemento de factura no encontrado');
    }

    // Esperar un poco más para asegurar renderizado completo
    await new Promise(resolve => setTimeout(resolve, 300));

    // Asegurar que el elemento tenga dimensiones correctas
    const originalDisplay = element.style.display;
    element.style.display = 'block';
    element.style.width = '80mm';
    element.style.minHeight = 'auto';

    const canvas = await html2canvas(element, {
      scale: 3, // Mayor escala para mejor calidad
      logging: true,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    // Restaurar estilos originales
    element.style.display = originalDisplay;
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calcular altura proporcional para el rollo
    const rolloAncho = 80; // mm
    const alturaProporcion = (canvas.height * rolloAncho) / canvas.width;
    
    // Asegurar altura mínima
    const alturaFinal = Math.max(alturaProporcion, 150); // Mínimo 150mm de altura
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [rolloAncho, alturaFinal]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, rolloAncho, alturaProporcion);
    
    return pdf;
  } catch (error) {
    console.error('Error generando PDF rollo:', error);
    throw error;
  }
};

export const descargarPDF = (pdf, filename) => {
  try {
    pdf.save(filename);
  } catch (error) {
    console.error('Error descargando PDF:', error);
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const obtenerBase64PDF = (pdf) => {
  return pdf.output('datauristring');
};