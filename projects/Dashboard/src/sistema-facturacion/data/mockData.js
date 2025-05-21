export const clientes = [
  {
    id: 1,
    numContrato: "2024-001234",
    numMedidor: "MED-120001",
    ci: "7654321",
    nombre: "Juan Carlos",
    apellido: "Mendoza López",
    direccion: "Av. Blanco Galindo #1234",
    zona: "Villa Pagador",
    distrito: "Distrito 3",
    categoria: "R3", // Residencial económico
    email: "juan.mendoza@email.com",
    telefono: "70123456"
  },
  {
    id: 2,
    numContrato: "2024-001235",
    numMedidor: "MED-120002",
    ci: "8765432",
    nombre: "María",
    apellido: "Rodriguez Vargas",
    direccion: "Calle Sucre #567",
    zona: "Cala Cala",
    distrito: "Distrito 5",
    categoria: "C", // Comercial
    email: "maria.rodriguez@email.com",
    telefono: "71234567"
  }
];

export const consumos = {
  "MED-120001": [
    { periodo: "2025-01", lectura: 12345, consumo: 15 },
    { periodo: "2025-02", lectura: 12360, consumo: 15 },
    { periodo: "2025-03", lectura: 12378, consumo: 18 },
    { periodo: "2025-04", lectura: 12395, consumo: 17 },
    { periodo: "2025-05", lectura: 12415, consumo: 20 }
  ],
  "MED-120002": [
    { periodo: "2025-01", lectura: 23456, consumo: 45 },
    { periodo: "2025-02", lectura: 23501, consumo: 45 },
    { periodo: "2025-03", lectura: 23550, consumo: 49 },
    { periodo: "2025-04", lectura: 23602, consumo: 52 },
    { periodo: "2025-05", lectura: 23660, consumo: 58 }
  ]
};