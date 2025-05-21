import { ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";
import { useState, useEffect } from "react";

const RADIAN = Math.PI / 180;
const data = [
  { name: "Consumo nulo", value: 300, color: "#fc3535" },
  { name: "Consumo Promedio", value: 300, color: "#2d7ef7" },
  { name: "Consumo excesivo", value: 300, color: "#fc3535" },
];
const cx = 160; //centerX
const cy = 120; //centerY
const iR = 45; //innerRadious
const oR = 100; //outerRadious
// const value = 560;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle
      key="needle-circle"
      cx={x0}
      cy={y0}
      r={r}
      fill={color}
      stroke="none"
    />,
    <path
      key="needle-path"
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#fff"
      fill={color}
    />,
  ];
};

export default function ConsumoPromedio() {
  const [value, setValue] = useState(560);

  const fetchValue = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetchConsumoPromedio`);
      setValue(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchValue();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" aspect={2}>
      <PieChart>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, data, cx, cy, iR, oR, "#000000")}
        <text
          x={cx + 5}
          y={cy + 25}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill:
              value < data[0].value
                ? "red"
                : value <= data[0].value + data[1].value
                  ? "blue"
                  : "red",
            fontSize: "1.5rem",
          }}
        >
          {value} Litros de Agua
        </text>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
