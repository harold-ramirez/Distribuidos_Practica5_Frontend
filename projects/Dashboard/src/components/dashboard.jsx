import ConsumoMeses from "./consumoMeses";
import ConsumoPromedio from "./consumoPromedio";
import ConsumoZonas from "./consumoZonas";

export default function Dashboard() {
  const cityConsumption = 25254325;
  const workingMeters = 109309;
  const failingMeters = 9122;
  return (
    <span className="p-1  w-full h-full text-black overflow-hidden">
      <div className="w-full h-full rounded-xl grid grid-cols-9 grid-rows-6 gap-2">
        <div class="bg-gray-300 rounded-xl col-start-1 row-start-1 col-span-5 row-span-6">
          1
        </div>
        <div class="bg-gray-300 rounded-xl col-start-6 row-start-1 col-span-2 row-span-2 p-1 flex flex-col wrap-anywhere">
          <strong>Consumo de la Ciudad m3/hora</strong>
          <p className="text-6xl font-bold flex flex-1 items-center justify-center">
            {cityConsumption.toLocaleString("es-ES")}
          </p>
        </div>
        <div class="bg-gray-300 rounded-xl col-start-8 row-start-1 col-span-2 row-span-1 px-3 flex flex-col wrap-anywhere">
          <strong>Medidores Reportando:</strong>
          <p className="text-4xl font-semibold flex flex-1 items-center justify-end">
            {workingMeters.toLocaleString("es-ES")}
          </p>
        </div>
        <div class="bg-gray-300 rounded-xl col-start-8 row-start-2 col-span-2 row-span-1 px-3 flex flex-col wrap-anywhere">
          <strong>Medidores con Errores:</strong>
          <p className="text-4xl text-red-500 font-semibold flex flex-1 items-center justify-end">
            {failingMeters.toLocaleString("es-ES")}
          </p>
        </div>
        <div class="bg-gray-300 rounded-xl col-start-6 row-start-3 col-span-4 row-span-2">
          <ConsumoMeses />
        </div>
        <div class="bg-gray-300 rounded-xl col-start-6 row-start-5 col-span-2 row-span-2">
          <ConsumoZonas />
        </div>
        <div class="bg-gray-300 rounded-xl col-start-8 row-start-5 col-span-2 row-span-2 p-1">
          <strong>Consumo de agua promedio por persona</strong>
          <ConsumoPromedio />
        </div>
      </div>
    </span>
  );
}
