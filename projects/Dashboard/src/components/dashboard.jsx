import ConsumoMeses from "./consumoMeses";
import ConsumoPromedio from "./consumoPromedio";
import ConsumoZonas from "./consumoZonas";
import Mapa from "./mapa";
import DetallesMedidor from "./detallesMedidor";

export default function Dashboard({resultados}) {
  // const currentMedidor = {
  //   id: 1,
  //   cuenta: "123456789",
  //   propietario: "Juan Perez",
  //   distrito: 9,
  //   medidor: "123",
  //   tipo: "Sagemcom",
  //   consumo: [100, 200, 300, 400, 500],
  //   latitud: -17.417482946453116,
  //   longitud: -66.1298692752899,
  // };

  const cityConsumption = 25254325;
  const workingMeters = 109309;
  const failingMeters = 9122;

  return (
    <span className="p-1 w-full h-full overflow-hidden text-black">
      <div className="gap-2 grid grid-cols-9 grid-rows-6 rounded-xl w-full h-full">
        <div className="flex flex-col row-span-6 bg-gray-300 p-1 rounded-xl">
          <DetallesMedidor medidor={resultados} />
        </div>
        <div className="col-span-4 row-span-6 bg-gray-300 p-1 rounded-xl wrap-anywhere">
          <Mapa />
        </div>
        <div className="flex flex-col col-span-2 col-start-6 row-span-2 bg-gray-300 p-1 rounded-xl wrap-anywhere">
          <strong>Consumo de la Ciudad m3/hora</strong>
          <p className="flex flex-1 justify-center items-center font-bold text-6xl">
            {cityConsumption.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="flex flex-col col-span-2 col-start-8 bg-gray-300 px-3 rounded-xl wrap-anywhere">
          <strong>Medidores Reportando:</strong>
          <p className="flex flex-1 justify-end items-center font-semibold text-6xl">
            {workingMeters.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="flex flex-col col-span-2 col-start-8 row-start-2 bg-gray-300 px-3 rounded-xl wrap-anywhere">
          <strong>Medidores con Errores:</strong>
          <p className="flex flex-1 justify-end items-center font-semibold text-red-500 text-6xl">
            {failingMeters.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="col-span-4 col-start-6 row-span-2 row-start-3 bg-gray-300 rounded-xl">
          <ConsumoMeses />
        </div>
        <div className="col-span-2 col-start-6 row-span-2 row-start-5 bg-gray-300 rounded-xl">
          <ConsumoZonas />
        </div>
        <div className="col-span-2 col-start-8 row-span-2 row-start-5 bg-gray-300 p-1 rounded-xl">
          <strong>Consumo de agua promedio por persona</strong>
          <ConsumoPromedio />
        </div>
      </div>
    </span>
  );
}
