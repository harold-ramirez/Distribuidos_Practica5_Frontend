import { useState } from 'react'
import Header from "../components/header"
import Dashboard from "../components/dashboard"
import medidores from "../data/medidores.json"

export default function Home() {
  const [resultados, setResultados] = useState([]);

  return(
    <span className="flex flex-col gap-3 bg-gray-700 w-full h-full">
      <Header medidores={medidores} setResultados={setResultados}/>
      <Dashboard resultados={resultados} />
    </span>
  )
}
