import { useState, useEffect } from "react";
import Header from "../components/header";
import Dashboard from "../components/dashboard";
import medidores from "../data/medidores.json"; // datos de prueba
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [medidores, setMedidores] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [medidorInfo, setMedidorInfo] = useState([
    {
      contrato: "---",
      cliente: "---",
      distrito: "---",
      medidor: "---",
      tipo: "---",
    },
  ]);

  const fetchResultados = async () => {
    //   if () { //datos de input (filtros del combobox, fechas)
    //     try {
    //       const response = await axios.get(`${API_BASE_URL}/vuelos/vuelos/filtrados`, {
    //         params: {
    //           origen: airportOrigin,
    //           destino: airportDestination,
    //           fecha: date,
    //         },
    //       });
    //       setResultados(response.data);
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   }
  };

  useEffect(() => {
    fetchResultados();
  }, [setResultados]);

  return (
    <span className="flex flex-col gap-3 bg-gray-700 w-full h-full">
      <Header
        medidores={medidores}
        setMedidorInfo={setMedidorInfo}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <Dashboard medidorInfo={medidorInfo} />
    </span>
  );
}
