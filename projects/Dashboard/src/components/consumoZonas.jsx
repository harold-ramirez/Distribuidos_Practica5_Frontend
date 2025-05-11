import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "QUERU QUERU ALTO",
    consumo: 4000,
  },
  {
    name: "ARANJUEZ ALTO",
    consumo: 3000,
  },
  {
    name: "MESADILLA",
    consumo: 2000,
  },
  {
    name: "MAYORAZGO",
    consumo: 2780,
  },
  {
    name: "CALA CALA",
    consumo: 1890,
  },
  {
    name: "CONDEBAMBA",
    consumo: 2390,
  },
  {
    name: "TEMPORAL PAMPA",
    consumo: 2390,
  },
  {
    name: "QUERU QUERU ALTO",
    consumo: 2390,
  },
  {
    name: "SARCO",
    consumo: 2390,
  },
];

export default function ConsumoZonas() {
  return (
    <ResponsiveContainer width="100%" height="100%" aspect={1}>
      <BarChart data={data} layout="vertical">
        <Bar dataKey="consumo" fill="#e38736" />
        <XAxis type="number" tick={{ fill: "#000", fontSize: 12 }} />
        <YAxis dataKey="name" type="category" tick={{ fill: "#000", fontSize: 12 }} />
        <Tooltip cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
