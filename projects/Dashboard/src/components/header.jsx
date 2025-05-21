import logo from '../assets/logo.png'
import Search from './search'
import DropdownList from './dropdownList'
import DatePicker from './datePicker'

export default function Header({ medidores, setMedidorInfo, startDate, endDate, setStartDate, setEndDate }){

  return (
    <div className="flex flex-row items-center bg-gray-300 p-2 w-full text-black">
      <img src={logo} alt="logo Semapa" width={250} />
      <section className='flex flex-row flex-1 justify-end items-center gap-3 p-2 h-full'>
        <Search medidores={ medidores } setMedidorInfo={setMedidorInfo} />
        <DropdownList/>
        <DatePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      </section>
    </div>
  )
}