const express = require("express");
const cassandra = require("cassandra-driver");
const cors = require("cors"); // Importa cors
const { DateTime } = require('luxon');

const app = express();
const port = 4000; //3001 // El puerto de tu backend (diferente al de Vite)

// Configura el cliente de Cassandra
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'semapa',
  socketOptions: {
    readTimeout: 120000 // 2 minutos por ejemplo
  }
});


// Conéctate a Cassandra (opcional, pero buena práctica para verificar la conexión al inicio)
client
  .connect()
  .then(() => console.log("✅Conectado a Cassandra✅"))
  .catch((err) => console.error("❌Error al conectar a Cassandra:", err, "❌"));

// Middleware
app.use(express.json()); // Para parsear el body de las solicitudes como JSON
app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend

// Define tus rutas de API----------------------------------------------------------------------------

// Implementado
app.get("/api/fetchConsumoMeses", async (req, res) => {
  try {
    const query =
      "SELECT fk_idmedidor, fecha, consumo FROM LecturaMedidor";
    const result = await client.execute(query);

    // Agrupa lecturas por medidor y por mes
    const consumosPorMedidorMes = {};
    result.rows.forEach((row) => {
      // aquí corregimos fk_idMedidor → fk_idmedidor
      const medidor = row.fk_idmedidor.toString();
      const fecha = new Date(row.fecha);
      const mes = fecha.toISOString().slice(0, 7); // YYYY-MM

      if (!consumosPorMedidorMes[mes]) consumosPorMedidorMes[mes] = {};
      if (!consumosPorMedidorMes[mes][medidor])
        consumosPorMedidorMes[mes][medidor] = [];
      consumosPorMedidorMes[mes][medidor].push(row.consumo);
    });

    // Calcula el consumo mensual por medidor (max - min por mes)
    const consumoPorMes = {};
    Object.entries(consumosPorMedidorMes).forEach(([mes, medidores]) => {
      let totalMes = 0;
      Object.values(medidores).forEach((consumos) => {
        if (consumos.length > 1) {
          const max = Math.max(...consumos);
          const min = Math.min(...consumos);
          totalMes += max - min;
        }
      });
      consumoPorMes[mes] = totalMes;
    });

    // Traduce el número de mes a nombre
    const mesesNombres = [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
    ];

    // Prepara el arreglo de respuesta ordenado
    const data = Object.entries(consumoPorMes).map(([mes, consumo]) => {
      const [, mesNum] = mes.split("-");
      return {
        name: mesesNombres[parseInt(mesNum, 10) - 1],
        consumo: Math.round(consumo * 100) / 100,
      };
    }).sort(
      (a, b) => mesesNombres.indexOf(a.name) - mesesNombres.indexOf(b.name)
    );

    res.json(data);
  } catch (err) {
    console.error("Error al calcular consumo mensual:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchConsumoPromedio", async (req, res) => {
  try {
    const query =
      "SELECT fk_idmedidor, fecha, consumo FROM LecturaMedidor WHERE estado = 1 AND fecha >= '2025-04-01T00:00:00+0000' AND fecha <= '2025-04-22T23:59:59+0000'  LIMIT 10000 ALLOW FILTERING;";
    const result = await client.execute(query);

    // Agrupa lecturas por medidor y por día
    const consumosPorMedidorDia = {};
    result.rows.forEach((row) => {
      const medidor = row.fk_idmedidor.toString();
      const dia = new Date(row.fecha).toISOString().slice(0, 10); // YYYY-MM-DD

      if (!consumosPorMedidorDia[medidor]) consumosPorMedidorDia[medidor] = {};
      if (!consumosPorMedidorDia[medidor][dia])
        consumosPorMedidorDia[medidor][dia] = [];
      consumosPorMedidorDia[medidor][dia].push(row.consumo);
    });

    // Recolecta todas las diferencias diarias
    const diffs = [];
    Object.values(consumosPorMedidorDia).forEach((dias) => {
      Object.values(dias).forEach((vals) => {
        if (vals.length > 1) {
          diffs.push(Math.max(...vals) - Math.min(...vals));
        }
      });
    });

    // Calcula promedio y devuelve un Number
    const promedio =
      diffs.length > 0
        ? diffs.reduce((a, b) => a + b, 0) / diffs.length
        : 0;

    res.json(Number(promedio.toFixed(2)));
  } catch (err) {
    console.error("Error al calcular consumo promedio diario:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});


app.get("/api/fetchConsumoZonas", async (req, res) => {
  try {
    // 1. Trae todas las lecturas con fk_idDistrito y consumo
    const lecturasQuery = "SELECT fk_iddistrito, consumo FROM LecturaMedidor";
    const lecturasResult = await client.execute(lecturasQuery);

    // 2. Trae todos los subdistritos para mapear fk_idDistrito -> idSubDistrito
    const subdistritosQuery = "SELECT idsubdistrito, fk_iddistrito FROM SubDistrito";
    const subdistritosResult = await client.execute(subdistritosQuery);

    // 3. Trae todas las zonas y su fk_idsubdistrito
    const zonasQuery = "SELECT idzona, nombrezona, fk_idsubdistrito FROM Zona";
    const zonasResult = await client.execute(zonasQuery);

    // 4. Construye los mapas para los "joins" manuales (usando string para comparar UUID)
    const distritoToSubdistritos = {};
    subdistritosResult.rows.forEach((sd) => {
      const distritoId = sd.fk_iddistrito?.toString();
      if (!distritoId) return; // evitar datos inválidos

      if (!distritoToSubdistritos[distritoId]) distritoToSubdistritos[distritoId] = [];
      distritoToSubdistritos[distritoId].push(sd.idsubdistrito.toString());
    });

    const subdistritoToZonas = {};
    zonasResult.rows.forEach((z) => {
      const subdistritoId = z.fk_idsubdistrito?.toString();
      if (!subdistritoId) return;

      if (!subdistritoToZonas[subdistritoId]) subdistritoToZonas[subdistritoId] = [];
      subdistritoToZonas[subdistritoId].push(z.nombrezona);
    });

    // 5. Suma el consumo por zona filtrando valores inválidos
    const consumoPorZona = {};
    lecturasResult.rows.forEach((l) => {
      const distritoId = l.fk_iddistrito?.toString();
      if (!distritoId) return;

      const consumo = l.consumo;
      if (
        consumo !== null &&
        consumo !== undefined &&
        typeof consumo === "number" &&
        isFinite(consumo) &&
        consumo > 0 &&
        consumo < 1_000_000
      ) {
        const subdistritos = distritoToSubdistritos[distritoId] || [];
        subdistritos.forEach((subdistritoId) => {
          const zonas = subdistritoToZonas[subdistritoId] || [];
          zonas.forEach((zona) => {
            consumoPorZona[zona] = (consumoPorZona[zona] || 0) + consumo;
          });
        });
      }
    });

    // 6. Preparar arreglo para la respuesta, ordenado por consumo descendente
    const data = Object.entries(consumoPorZona)
      .map(([name, consumo]) => ({
        name,
        consumo: Math.round(consumo * 100) / 100,
      }))
      .sort((a, b) => b.consumo - a.consumo);

    res.json(data);
  } catch (err) {
    console.error("Error al obtener consumo por zonas:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

app.get("/api/fetchCityConsumption", async (req, res) => {
  try {
    const estado = 1;
    const limit = 10000; // máximo de filas a considerar
    const query = `
      SELECT consumo FROM lecturamedidor 
      WHERE estado = ? ALLOW FILTERING;
    `;

    const result = await client.execute(query, [estado], { prepare: true, fetchSize: 1000 });

    let totalConsumo = 0;
    let invalidCount = 0;
    let rowCount = 0;

    for (const row of result.rows) {
      if (rowCount >= limit) break;

      const value = row.consumo;
      let consumo = typeof value?.toNumber === "function" ? value.toNumber() : Number(value);

      if (!isNaN(consumo) && isFinite(consumo) && consumo > 0 && consumo < 1e6) {
        totalConsumo += consumo;
        rowCount++;
      } else {
        invalidCount++;
        console.warn(`❌ Consumo descartado #${invalidCount}:`, value);
      }
    }

    res.json({
      totalConsumo: Number(totalConsumo.toFixed(2)),
      registros: rowCount,
      descartados: invalidCount
    });
  } catch (err) {
    console.error("🔥 Error al obtener consumo total de la ciudad:", err.message);
    res.status(500).json({
      error: "Error al obtener datos",
      detalle: err.message,
      tipo: err.code || "UNKNOWN"
    });
  }
});


const executeWithRetry = async (query, params, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.execute(query, params, { prepare: true });
    } catch (err) {
      console.warn(`⚠️ Intento ${i + 1} fallido:`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err;
    }
  }
};


app.get("/api/fetchWorkingMeters", async (req, res) => {
  try {
    // Consulta para traer idLectura que cumplan estado y fecha
    const query = `
SELECT idLectura FROM LecturaMedidor WHERE estado = 1 AND fecha >= '2025-04-01T00:00:00+0000' AND fecha <= '2025-04-22T23:59:59+0000'  LIMIT 10000 ALLOW FILTERING`;

    const result = await client.execute(query);

    // Contar filas que llegaron
    const count = result.rows.length;

    res.json({ count });
  } catch (err) {
    console.error("Error al obtener medidores funcionando:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});


app.get("/api/fetchFailingMeters", async (req, res) => {
  try {
    const startDate = new Date('2025-04-01T00:00:00Z');
    const endDate = new Date('2025-04-01T00:00:00Z');
    let totalEstado = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const from = new Date(d);
      const to = new Date(d);
      to.setDate(from.getDate() + 1);

      const query = `
        SELECT COUNT(*) AS total FROM LecturaMedidor
        WHERE estado = 1 AND fecha >= ? AND fecha < ?
        ALLOW FILTERING
      `;

      try {
        // PASAMOS objetos Date directamente (NO ISOString)
        const result = await client.execute(query, [from, to], { prepare: true });
        const count = result.rows[0]?.total?.toInt?.() ?? 0;
        totalEstado += count;
      } catch (err) {
        console.warn(`Error en consulta por fecha ${from.toISOString()}:`, err.message);
      }
    }

    // Para obtener totalError, hacemos consulta sin filtro IS NOT NULL
    const queryError = 'SELECT error FROM LecturaMedidor ALLOW FILTERING';
    const resultError = await client.execute(queryError);
    // Filtramos en JS
    const totalError = resultError.rows.filter(row => row.error !== null).length;

    const total = totalEstado + totalError;
    res.json({ count: total });

  } catch (error) {
    console.error("Error al obtener medidores con error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



// Implementado
app.get("/api/fetchMapaCalor", async (req, res) => {
  try {
    // Trae consumo, latitud y longitud de cada medidor instalado
    const query =
      "SELECT consumo, latitud, longitud FROM LecturaMedidor WHERE estado = 1 AND fecha >= '2025-04-01T00:00:00+0000' AND fecha <= '2025-04-22T23:59:59+0000'  LIMIT 10000 ALLOW FILTERING";
    const result = await client.execute(query);

    // Construye el GeoJSON
    const features = result.rows.map((row, idx) => ({
      type: "Feature",
      properties: {
        consumo: row.consumo,
        name: `Medidor${idx + 1}`,
      },
      geometry: {
        type: "Point",
        coordinates: [row.longitud, row.latitud],
      },
    }));

    const geojson = {
      type: "FeatureCollection",
      features,
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error al obtener datos de mapa de calor:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});
app.post("/api/registrarConsumo", async (req, res) => {
  const {
    idlectura,
    fk_idmedidor,
    fk_idusuario,
    consumo,
    fecha,
    latitud,
    longitud,
    estado,
    fk_iddistrito,
  } = req.body;

  try {
    const query = `
      INSERT INTO LecturaMedidor (
        idlectura, fk_idmedidor, fk_idusuario,
        consumo, fecha, latitud, longitud,
        estado, fk_iddistrito
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

   const params = [
  idlectura,
  fk_idmedidor,
  fk_idusuario,
  consumo,
  fecha,
  latitud,
  longitud,
  estado,
  fk_iddistrito,
];

await client.execute(query, params, { prepare: true });

res.json({ message: "Lectura registrada exitosamente" });
  } catch (err) {
    console.error("❌ Error al insertar lectura:", err);
    res.status(500).json({ error: "Error al insertar lectura" });
  }
});


app.get("/api/fetchMedidoresHome", async (req, res) => {
  try {
    // 1. Traer todas las lecturas (cada una representa un medidor instalado)
    const lecturasQuery =
      "SELECT idlectura, latitud, longitud, fk_idmedidor, fk_idusuario FROM LecturaMedidor WHERE estado = 1 AND fecha >= '2025-04-01T00:00:00+0000' AND fecha <= '2025-04-22T23:59:59+0000'  LIMIT 10000 ALLOW FILTERING";
    const lecturasResult = await client.execute(lecturasQuery);
    const lecturas = lecturasResult.rows;
 
    // 2. Obtener todos los medidores base
    const medidoresQuery = "SELECT idmedidor, tipoMedidor, modelo FROM Medidor";
    const medidoresResult = await client.execute(medidoresQuery);
    const medidoresMap = {};
    medidoresResult.rows.forEach((m) => {
      medidoresMap[m.idmedidor.toString()] = m;
    });
 
    // 3. Obtener todos los usuarios
    const usuariosQuery =
      "SELECT idusuario, nombre, telefono, correoElectronico FROM Usuario";
    const usuariosResult = await client.execute(usuariosQuery);
    // Normaliza los UUID a minúsculas y sin guiones para el mapeo
    const usuariosMap = {};
    usuariosResult.rows.forEach((u) => {
      usuariosMap[u.idusuario.toString().toLowerCase()] = u;
    });
 
    // 4. Obtener todos los contratos (para el número de contrato)
    const contratosQuery =
      "SELECT idcontrato, numeroContrato, fk_idusuario FROM Contrato";
    const contratosResult = await client.execute(contratosQuery);
    // Mapeamos por fk_idusuario para encontrar el contrato de cada usuario
    const usuarioToContrato = {};
    contratosResult.rows.forEach((c) => {
      if (c.fk_idusuario) {
        usuarioToContrato[c.fk_idusuario.toString().toLowerCase()] = c.numerocontrato;
      }
    });
 
    // 5. Unir los datos (normalizando los UUIDs)
    const data = lecturas.map((l) => {
      const medidor = medidoresMap[l.fk_idmedidor?.toString()] || {};
      // Normaliza el UUID de usuario para buscarlo correctamente
      const usuarioKey = l.fk_idusuario ? l.fk_idusuario.toString().toLowerCase() : null;
      const usuario = usuarioKey ? usuariosMap[usuarioKey] : {};
      const numeroContrato = usuarioKey ? usuarioToContrato[usuarioKey] : null;
 
      return {
        latitud: l.latitud,
        longitud: l.longitud,
        tipoMedidor: medidor.tipomedidor || null,
        modelo: medidor.modelo || null,
        numeroContrato: numeroContrato || null,
        nombre: usuario?.nombre || null,
        telefono: usuario?.telefono || null,
        correoElectronico: usuario?.correoelectronico || null,
      };
    });
 
    res.json(data);
  } catch (err) {
    console.error("Error al obtener datos de medidores:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});
//------------------------------------------------------------------------------------------------
// Inicia el servidor-----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(
    `🟢Backend de Cassandra escuchando en http://localhost:${port}🟢`
  );
});
