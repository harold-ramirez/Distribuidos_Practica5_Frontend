import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { BsBarChartLine } from "react-icons/bs";
import EnviarRecibo from "./enviarRecibo";
import ConsumoMedidor from "./consumoMedidor";

export default function DetallesMedidor({ medidor }) {
  const [showEnviarRecibo, setShowEnviarRecibo] = useState(false);
  const handleEnviarRecibo = () => {
    setShowEnviarRecibo(!showEnviarRecibo);
  };
  const [showConsumoMedidor, setShowConsumoMedidor] = useState(false);
  const handleConsumoMedidor = () => {
    setShowConsumoMedidor(!showConsumoMedidor);
  };

  return (
    <>
      <h1 className="font-bold text-3xl">DETALLE</h1>
      <span className="flex flex-col flex-1 items-start p-1">
        <strong>Cuenta: </strong>
        <p className="w-full text-center">{medidor.cuenta}</p>
        <strong>Propietario: </strong>
        <p className="w-full text-center">{medidor.propietario}</p>
        <strong>Distrito: </strong>
        <p className="w-full text-center">{medidor.distrito}</p>
        <strong>Medidor: </strong>
        <p className="w-full text-center">{medidor.medidor}</p>
        <strong>Tipo: </strong>
        <p className="w-full text-center">{medidor.tipo}</p>
      </span>

      <button
        onClick={handleConsumoMedidor}
        className="flex flex-row items-center gap-2 bg-green-300 mb-2 p-2 border border-black rounded-xl font-bold cursor-pointer"
      >
        <BsBarChartLine size={28} /> Ver Consumo
      </button>
      {showConsumoMedidor && (
        <ConsumoMedidor medidor={medidor} onClose={handleConsumoMedidor} />
      )}

      <button
        onClick={handleEnviarRecibo}
        className="flex flex-row items-center gap-2 bg-blue-400 mb-2 px-1 py-2 border border-black rounded-xl font-bold cursor-pointer"
      >
        <LuSendHorizontal size={28} /> Enviar Recibo
      </button>
      {showEnviarRecibo && (
        <EnviarRecibo medidor={medidor} onClose={handleEnviarRecibo} />
      )}
    </>
  );
}
