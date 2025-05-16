import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
//CONSUMO POR HORA
export default function ConsumoMedidor({ onClose }) {
  //medidor
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
    },
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

  return (
    <div
      onClick={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      className="top-0 left-0 z-50 fixed flex justify-center items-center w-full h-full text-black"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-300 p-3 rounded-xl w-2/5 flex flex-col"
      >
        <h1 className="font-bold text-3xl">
          --------- CONSUMO MEDIDOR ---------
        </h1>
        <span className="mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Tooltip cursor={false} content={<CustomTooltip />} />
              <Bar dataKey="consumo" fill="#42abfc" />
              <XAxis dataKey="name" tick={{ fill: "#000", fontSize: 12 }} />
              <YAxis tick={{ fill: "#000", fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </span>
      </div>
    </div>
  );
}
