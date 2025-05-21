import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";
import { useState, useEffect } from "react";

const data = [
  {
    name: "Enero",
    consumo: 4000,
  },
  {
    name: "Febrero",
    consumo: 3000,
  },
  {
    name: "Marzo",
    consumo: 2000,
  },
  {
    name: "Abril",
    consumo: 2780,
  },
  {
    name: "Mayo",
    consumo: 1890,
  },
  {
    name: "Junio",
    consumo: 2390,
  }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-900 text-white p-2 rounded-lg shadow-lg">
        <p className="text-lg font-bold">{label}</p>
        <p className="">{`${payload[0].value} litros de agua`}</p>
      </div>
    );
  }

  return null;
};

export default function ConsumoMeses() {
  // const [data, setData] = useState([]);

  const fetchData = async () => {
    //     try {
    //       const response = await axios.get(`${API_BASE_URL}/vuelos/vuelos/filtrados`, {
    //         params: {
    //           origen: airportOrigin,
    //           destino: airportDestination,
    //           fecha: date,
    //         },
    //       });
    //       setData(response.data);
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Tooltip cursor={false} content={<CustomTooltip/>} />
        <Bar dataKey="consumo" fill="#8884d8" />
        <XAxis dataKey="name" tick={{ fill: "#000", fontSize: 12 }} />
        <YAxis tick={{ fill: "#000", fontSize: 12 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
