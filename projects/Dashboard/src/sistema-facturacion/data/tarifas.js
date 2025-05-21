// Basado en el reglamento tarifario
export const tarifas = {
  R1: { nombre: "Doméstico - Sin servicio", precioM3: 1.50, cargoFijo: 5.00 },
  R2: { nombre: "Doméstico - Precario", precioM3: 2.00, cargoFijo: 8.00 },
  R3: { nombre: "Doméstico - Económico", precioM3: 2.50, cargoFijo: 10.00 },
  R4: { nombre: "Doméstico - Confortable", precioM3: 3.00, cargoFijo: 15.00 },
  C: { nombre: "Comercial", precioM3: 4.50, cargoFijo: 25.00 },
  CE: { nombre: "Comercial Especial", precioM3: 5.50, cargoFijo: 35.00 },
  I: { nombre: "Industrial", precioM3: 6.00, cargoFijo: 40.00 },
  P: { nombre: "Preferencial", precioM3: 1.00, cargoFijo: 3.00 },
  S: { nombre: "Social", precioM3: 0.80, cargoFijo: 2.00 }
};

// Cargo por alcantarillado basado en categoría
export const alcantarillado = {
  R1: 0,
  R2: 8.00,
  R3: 17.00,
  R4: 31.50,
  C: 45.00,
  CE: 65.00,
  I: 80.00,
  P: 5.00,
  S: 3.00
};