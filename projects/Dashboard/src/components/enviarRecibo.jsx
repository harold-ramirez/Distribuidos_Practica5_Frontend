import { MdOutlineMail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineTextsms } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function EnviarRecibo({ medidor, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      className="top-0 left-0 z-50 fixed flex justify-center items-center w-full h-full text-black"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-300 p-3 rounded-xl w-2/5"
      >
        <h1 className="font-bold text-3xl">
          --------- RECIBO DE AGUA ---------
        </h1>
        <span className="flex flex-row justify-evenly">
          <IoDocumentTextOutline size={120} className="my-auto" />
          <span className="flex flex-col justify-center items-start p-2">
            <label>
              <strong>Contrato: </strong> {medidor[0].contrato} <br />
            </label>
            <label>
              <strong>Cliente: </strong> {medidor[0].cliente} <br />
            </label>
            <label>
              <strong>Distrito: </strong> {medidor[0].distrito} <br />
            </label>
            <label>
              <strong>Medidor: </strong> {medidor[0].medidor} <br />
            </label>
            <label>
              <strong>Tipo: </strong> {medidor[0].tipo} <br />
            </label>
          </span>
          <span className="flex flex-col items-start p-2">
            <label>
              <strong>Periodo: </strong> 05-2025 <br />
            </label>
            <label>
              <strong>Consumo: </strong> 200 m3 <br />
            </label>
          </span>
        </span>

        <h2>--------------- Enviar Recibo Via: ----------------</h2>
        <span className="flex flex-row justify-evenly mt-2">
          <button
            onClick={onClose}
            className="flex flex-row justify-center items-center gap-2 bg-gray-200 hover:bg-purple-700 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] p-2 border-2 border-purple-700 rounded-md w-2/7 h-10 font-bold text-purple-700 hover:text-white transition-all cursor-pointer"
          >
            <MdOutlineMail size={25} /> E-mail
          </button>
          <button
            onClick={onClose}
            className="flex flex-row justify-center items-center gap-2 bg-gray-200 hover:bg-green-700 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] p-2 border-2 border-green-700 rounded-md w-2/7 h-10 font-bold text-green-700 hover:text-white transition-all cursor-pointer"
          >
            <FaWhatsapp size={25} /> WhatsApp
          </button>
          <button
            onClick={onClose}
            className="flex flex-row justify-center items-center gap-2 bg-gray-200 hover:bg-blue-700 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] p-2 border-2 border-blue-700 rounded-md w-2/7 h-10 font-bold text-blue-700 hover:text-white transition-all cursor-pointer"
          >
            <MdOutlineTextsms size={25} /> SMS
          </button>
        </span>
      </div>
    </div>
  );
}
