import { useState, useEffect } from "react";
import ConsumoMeses from "./consumoMeses";
import ConsumoPromedio from "./consumoPromedio";
import ConsumoZonas from "./consumoZonas";
import Mapa from "./mapa";
import DetallesMedidor from "./detallesMedidor";
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";

export default function Dashboard({ medidorInfo, medidores }) {
  const [cityConsumption, setCityConsumption] = useState(25254325);
  const [workingMeters, setWorkingMeters] = useState(109309);
  const [failingMeters, setFailingMeters] = useState(9122);

const fetchCityConsumption = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetchCityConsumption`);
    const data = response.data;

    let value = 0;
    if (typeof data === "number") {
      value = data;
    } else if (data && typeof data.totalConsumo === "number") {
      value = data.totalConsumo;
    } else {
      console.warn("Formato de datos inesperado:", data);
    }

    setCityConsumption(value);
  } catch (error) {
    console.error("Error fetching city consumption:", error);
  }
};



const fetchWorkingMeters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetchWorkingMeters`);
    setWorkingMeters(response.data.count ?? response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  const fetchFailingMeters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchFailingMeters`);
      setFailingMeters(response.data.count ?? response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCityConsumption();
    fetchWorkingMeters();
    fetchFailingMeters();
  }, []);

  return (
    <span className="p-1 w-full h-full overflow-hidden text-black">
      <div className="gap-2 grid grid-cols-9 grid-rows-6 rounded-xl w-full h-full">
        <div className="flex flex-col row-span-6 bg-gray-300 p-1 rounded-xl">
          <DetallesMedidor medidorInfo={medidorInfo} />
        </div>
        <div className="col-span-4 row-span-6 bg-gray-300 p-1 rounded-xl wrap-anywhere">
          <Mapa medidores={medidores} />
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
