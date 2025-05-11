import { IoSearch } from "react-icons/io5";

export default function Search(){

  return (
    <span className="border border-black rounded-lg flex flex-row items-center">
      <input type="text" placeholder="Buscar..." className="h-10 text-lg p-1"/>
      <IoSearch size={30}/>
    </span>
  )
}