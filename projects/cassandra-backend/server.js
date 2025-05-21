const express = require("express");
const cassandra = require("cassandra-driver");
const cors = require("cors"); // Importa cors

const app = express();
const port = 4000; //3001 // El puerto de tu backend (diferente al de Vite)

// Configura el cliente de Cassandra
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1", // Reemplaza con tu nombre de centro de datos
  keyspace: "semapa", // Reemplaza con tu keyspace
  // Si tienes autenticación en Cassandra:
  // authProvider: new cassandra.auth.PlainTextAuthProvider('username', 'password')
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
app.get("/api/fetchMedidoresHome", async (req, res) => {
  try {
    // 1. Traer todas las lecturas (cada una representa un medidor instalado)
    const lecturasQuery =
      "SELECT idLectura, latitud, longitud, fk_idMedidor, fk_idUsuario FROM LecturaMedidor ALLOW FILTERING";
    const lecturasResult = await client.execute(lecturasQuery);
    const lecturas = lecturasResult.rows;

    // 2. Obtener todos los medidores base
    const medidoresQuery = "SELECT idMedidor, tipoMedidor, modelo FROM Medidor";
    const medidoresResult = await client.execute(medidoresQuery);
    const medidoresMap = {};
    medidoresResult.rows.forEach((m) => {
      medidoresMap[m.idmedidor.toString()] = m;
    });

    // 3. Obtener todos los usuarios
    const usuariosQuery =
      "SELECT idUsuario, nombre, telefono, correoElectronico FROM Usuario";
    const usuariosResult = await client.execute(usuariosQuery);
    const usuariosMap = {};
    usuariosResult.rows.forEach((u) => {
      usuariosMap[u.idusuario.toString()] = u;
    });

    // 4. Obtener todos los contratos (para el número de contrato)
    const contratosQuery =
      "SELECT idContrato, numeroContrato, fk_idUsuario FROM Contrato";
    const contratosResult = await client.execute(contratosQuery);
    const contratosMap = {};
    contratosResult.rows.forEach((c) => {
      contratosMap[c.fk_idusuario.toString()] = c.numerocontrato;
    });

    // 5. Unir los datos
    const data = lecturas.map((l) => {
      const medidor = medidoresMap[l.fk_idmedidor?.toString()] || {};
      const usuario = usuariosMap[l.fk_idusuario?.toString()] || {};
      const numeroContrato = contratosMap[l.fk_idusuario?.toString()] || null;

      return {
        latitud: l.latitud,
        longitud: l.longitud,
        tipoMedidor: medidor.tipomedidor || null,
        modelo: medidor.modelo || null,
        numeroContrato: numeroContrato,
        nombre: usuario.nombre || null,
        telefono: usuario.telefono || null,
        correoElectronico: usuario.correoelectronico || null,
      };
    });

    res.json(data);
  } catch (err) {
    console.error("Error al obtener datos de medidores:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchConsumoMeses", async (req, res) => {
  try {
    const query =
      "SELECT fk_idMedidor, fecha, consumo FROM LecturaMedidor ALLOW FILTERING";
    const result = await client.execute(query);

    // Agrupa lecturas por medidor y por mes
    const consumosPorMedidorMes = {};
    result.rows.forEach((row) => {
      const medidor = row.fk_idMedidor.toString();
      const fecha = new Date(row.fecha);
      // Normaliza la fecha al mes (YYYY-MM)
      const mes = fecha.toISOString().slice(0, 7);

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

    // Traduce el número de mes a nombre (opcional, puedes ajustar a tu gusto)
    const mesesNombres = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // Prepara el arreglo de respuesta
    const data = Object.entries(consumoPorMes).map(([mes, consumo]) => {
      const [anio, mesNum] = mes.split("-");
      return {
        name: mesesNombres[parseInt(mesNum, 10) - 1],
        consumo: Math.round(consumo * 100) / 100, // Redondea a 2 decimales
      };
    });

    // Ordena por mes (opcional)
    data.sort(
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
    // Trae solo los campos necesarios para eficiencia
    const query =
      "SELECT fk_idMedidor, fecha, consumo FROM LecturaMedidor ALLOW FILTERING";
    const result = await client.execute(query);

    // Agrupa lecturas por medidor y por día
    const consumosPorMedidorDia = {};
    result.rows.forEach((row) => {
      const medidor = row.fk_idMedidor.toString();
      const fecha = new Date(row.fecha);
      // Normaliza la fecha al día (YYYY-MM-DD)
      const dia = fecha.toISOString().slice(0, 10);

      if (!consumosPorMedidorDia[medidor]) consumosPorMedidorDia[medidor] = {};
      if (!consumosPorMedidorDia[medidor][dia])
        consumosPorMedidorDia[medidor][dia] = [];
      consumosPorMedidorDia[medidor][dia].push(row.consumo);
    });

    // Calcula el consumo diario por medidor (max - min por día)
    let consumosDiarios = [];
    Object.values(consumosPorMedidorDia).forEach((dias) => {
      Object.values(dias).forEach((consumos) => {
        if (consumos.length > 1) {
          const max = Math.max(...consumos);
          const min = Math.min(...consumos);
          consumosDiarios.push(max - min);
        }
      });
    });

    // Promedio de todos los consumos diarios
    const promedio =
      consumosDiarios.length > 0
        ? consumosDiarios.reduce((a, b) => a + b, 0) / consumosDiarios.length
        : 0;

    res.json({ promedio });
  } catch (err) {
    console.error("Error al calcular consumo promedio diario:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchConsumoZonas", async (req, res) => {
  try {
    // 1. Trae todas las lecturas con fk_idDistrito y consumo
    const lecturasQuery =
      "SELECT fk_idDistrito, consumo FROM LecturaMedidor ALLOW FILTERING";
    const lecturasResult = await client.execute(lecturasQuery);

    // 2. Trae todos los subdistritos para mapear fk_idDistrito -> idSubDistrito
    const subdistritosQuery =
      "SELECT idSubDistrito, fk_idDistrito FROM SubDistrito";
    const subdistritosResult = await client.execute(subdistritosQuery);

    // 3. Trae todas las zonas y su fk_idSubDistrito
    const zonasQuery = "SELECT idZona, nombreZona, fk_idSubDistrito FROM Zona";
    const zonasResult = await client.execute(zonasQuery);

    // 4. Construye los mapas para los joins manuales
    // Mapea distrito -> [subdistritos]
    const distritoToSubdistritos = {};
    subdistritosResult.rows.forEach((sd) => {
      const distritoId = sd.fk_iddistrito.toString();
      if (!distritoToSubdistritos[distritoId])
        distritoToSubdistritos[distritoId] = [];
      distritoToSubdistritos[distritoId].push(sd.idsubdistrito.toString());
    });

    // Mapea subdistrito -> [zonas]
    const subdistritoToZonas = {};
    zonasResult.rows.forEach((z) => {
      const subdistritoId = z.fk_idsubdistrito.toString();
      if (!subdistritoToZonas[subdistritoId])
        subdistritoToZonas[subdistritoId] = [];
      subdistritoToZonas[subdistritoId].push(z.nombrezona);
    });

    // 5. Suma el consumo por zona
    const consumoPorZona = {};
    lecturasResult.rows.forEach((l) => {
      const distritoId = l.fk_iddistrito?.toString();
      const subdistritos = distritoToSubdistritos[distritoId] || [];
      subdistritos.forEach((subdistritoId) => {
        const zonas = subdistritoToZonas[subdistritoId] || [];
        zonas.forEach((zona) => {
          if (!consumoPorZona[zona]) consumoPorZona[zona] = 0;
          consumoPorZona[zona] += l.consumo || 0;
        });
      });
    });

    // 6. Prepara el arreglo de respuesta
    const data = Object.entries(consumoPorZona).map(([name, consumo]) => ({
      name,
      consumo: Math.round(consumo * 100) / 100, // Redondea a 2 decimales
    }));

    res.json(data);
  } catch (err) {
    console.error("Error al obtener consumo por zonas:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchCityConsumption", async (req, res) => {
  try {
    const query =
      "SELECT SUM(consumo) as total_consumo FROM LecturaMedidor ALLOW FILTERING";
    const result = await client.execute(query);
    // Cassandra devuelve sum como objeto tipo Double o similar
    const total = result.rows[0]["total_consumo"];
    res.json({ total });
  } catch (err) {
    console.error("Error al obtener consumo total de la ciudad:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchWorkingMeters", async (req, res) => {
  try {
    const query =
      "SELECT COUNT(idLectura) FROM LecturaMedidor WHERE estado = 1 ALLOW FILTERING";
    const result = await client.execute(query);
    // Cassandra devuelve count como objeto tipo Long, así que lo convertimos a número
    const count = result.rows[0]["count"].toNumber
      ? result.rows[0]["count"].toNumber()
      : result.rows[0]["count"];
    res.json({ count });
  } catch (err) {
    console.error("Error al obtener medidores funcionando:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchFailingMeters", async (req, res) => {
  try {
    const query =
      "SELECT COUNT(idLectura) FROM LecturaMedidor WHERE estado = 0 ALLOW FILTERING";
    const result = await client.execute(query);
    const count = result.rows[0]["count"].toNumber
      ? result.rows[0]["count"].toNumber()
      : result.rows[0]["count"];
    res.json({ count });
  } catch (err) {
    console.error("Error al obtener medidores fallando:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Implementado
app.get("/api/fetchMapaCalor", async (req, res) => {
  try {
    // Trae consumo, latitud y longitud de cada medidor instalado
    const query =
      "SELECT consumo, latitud, longitud FROM LecturaMedidor ALLOW FILTERING";
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

// MOVIL (NO IMPLEMENTADO)------------------------------------------------------------------------------------------------
app.post("/api/registrarConsumo", async (req, res) => {
  const { id, nombre, valor } = req.body; // Ejemplo de datos a insertar
  try {
    const query =
      "INSERT INTO tu_tabla_de_datos (id, nombre, valor) VALUES (?, ?, ?)";
    const params = [id, nombre, valor];
    await client.execute(query, params, { prepare: true }); // Usar prepared statements es buena práctica
    res.status(201).json({ message: "Datos insertados correctamente" });
  } catch (err) {
    console.error("Error al insertar datos en Cassandra:", err);
    res.status(500).json({ error: "Error al insertar datos" });
  }
});

//------------------------------------------------------------------------------------------------
// Inicia el servidor-----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(
    `🟢Backend de Cassandra escuchando en http://localhost:${port}🟢`
  );
});
