import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";
import { useState, useEffect } from "react";

// const data = [
//   {
//     name: "QUERU QUERU ALTO",
//     consumo: 4000,
//   },
//   {
//     name: "ARANJUEZ ALTO",
//     consumo: 3000,
//   },
//   {
//     name: "MESADILLA",
//     consumo: 2000,
//   },
//   {
//     name: "MAYORAZGO",
//     consumo: 2780,
//   },
//   {
//     name: "CALA CALA",
//     consumo: 1890,
//   },
//   {
//     name: "CONDEBAMBA",
//     consumo: 2390,
//   },
//   {
//     name: "TEMPORAL PAMPA",
//     consumo: 2390,
//   },
//   {
//     name: "QUERU QUERU ALTO",
//     consumo: 2390,
//   },
//   {
//     name: "SARCO",
//     consumo: 2390,
//   },
// ];

export default function ConsumoZonas() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchConsumoZonas`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" aspect={1}>
      <BarChart data={data} layout="vertical">
        <Bar dataKey="consumo" fill="#e38736" />
        <XAxis type="number" tick={{ fill: "#000", fontSize: 12 }} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: "#000", fontSize: 12 }}
        />
        <Tooltip cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
