import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function Search({ medidores, setMedidorInfo }) {
  const [text, setText] = useState("");

  const handleSearch = () => {
    if (text !== "") {
      const resultado = medidores.find(
        (m) =>
          m.contrato === text ||
          m.medidor === text ||
          m.cliente.toLowerCase() === text.toLowerCase()
      );
      if (resultado) {
        setMedidorInfo([resultado]);
      } else {
        setMedidorInfo([]);
        alert("No se encontró ningún medidor con ese criterio.");
      }
      setText("");
    }
  };

  return (
    <span className="flex flex-row items-center border border-black rounded-lg">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar..."
        className="p-1 h-10 text-lg"
      />
      <IoSearch onClick={handleSearch} size={40} className="cursor-pointer" />
    </span>
  );
}
