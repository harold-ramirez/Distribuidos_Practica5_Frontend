import { useState } from "react";

export default function DatePicker() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="flex flex-row gap-4">
      <div>
        <label>Desde:</label>
        <input
          type="date"
          className="bg-gray-700 ml-1 px-2 border rounded-lg h-10 text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>Hasta:</label>
        <input
          type="date"
          className="bg-gray-700 ml-1 px-2 border rounded-lg h-10 text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}
