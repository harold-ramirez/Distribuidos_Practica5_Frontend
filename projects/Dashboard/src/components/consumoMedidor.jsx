import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
//CONSUMO POR HORA
export default function ConsumoMedidor({ consumo, onClose }) {
  // const data = [
  //   {
  //     name: "01:00",
  //     consumo: 3000,
  //   },
  //   {
  //     name: "02:00",
  //     consumo: 2000,
  //   },
  //   {
  //     name: "03:00",
  //     consumo: 2780,
  //   },
  //   {
  //     name: "04:00",
  //     consumo: 1890,
  //   },
  //   {
  //     name: "05:00",
  //     consumo: 2390,
  //   },
  //   {
  //     name: "06:00",
  //     consumo: 4000,
  //   },
  //   {
  //     name: "07:00",
  //     consumo: 3000,
  //   },
  //   {
  //     name: "08:00",
  //     consumo: 2000,
  //   },
  //   {
  //     name: "09:00",
  //     consumo: 2780,
  //   },
  //   {
  //     name: "10:00",
  //     consumo: 1890,
  //   },
  //   {
  //     name: "11:00",
  //     consumo: 2390,
  //   },
  //   {
  //     name: "12:00",
  //     consumo: 4000,
  //   },
  //   {
  //     name: "13:00",
  //     consumo: 3000,
  //   },
  //   {
  //     name: "14:00",
  //     consumo: 2000,
  //   },
  //   {
  //     name: "15:00",
  //     consumo: 2780,
  //   },
  //   {
  //     name: "16:00",
  //     consumo: 1890,
  //   },
  //   {
  //     name: "17:00",
  //     consumo: 2390,
  //   },
  //   {
  //     name: "18:00",
  //     consumo: 4000,
  //   },
  //   {
  //     name: "19:00",
  //     consumo: 3000,
  //   },
  //   {
  //     name: "20:00",
  //     consumo: 2000,
  //   },
  //   {
  //     name: "21:00",
  //     consumo: 2780,
  //   },
  //   {
  //     name: "22:00",
  //     consumo: 1890,
  //   },
  //   {
  //     name: "23:00",
  //     consumo: 2390,
  //   },
  //   {
  //     name: "00:00",
  //     consumo: 4000,
  //   },
  // ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blue-900 shadow-lg p-2 rounded-lg text-white">
          <p className="font-bold text-lg">{label}</p>
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
        className="flex flex-col bg-gray-300 p-3 rounded-xl w-2/5 h-1/2"
      >
        <h1 className="font-bold text-3xl">
          --------- CONSUMO MEDIDOR ---------
        </h1>
        <ResponsiveContainer width="100%" height="100%" className={"mt-5"}>
          {consumo && consumo.length > 0 ? (
            <BarChart data={consumo}>
              <Tooltip cursor={false} content={<CustomTooltip />} />
              <Bar dataKey="consumo" fill="#42abfc" />
              <XAxis dataKey="name" tick={{ fill: "#000", fontSize: 12 }} />
              <YAxis tick={{ fill: "#000", fontSize: 12 }} />
            </BarChart>
          ) : (
            <div className="flex justify-center items-center w-full h-full italic">
              No hay datos para graficar...
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
