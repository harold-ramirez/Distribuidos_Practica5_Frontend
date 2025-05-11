import logo from '../assets/logo.png'
import Search from './search'
import DropdownList from './dropdownList'
import DatePicker from './datePicker'

export default function Header(){
  return (
    <div className="bg-gray-300 w-full flex flex-row items-center p-2 text-black">
      <img src={logo} alt="logo Semapa" width={250} />
      <section className='flex flex-row items-center justify-end gap-3 flex-1 h-full p-2'>
        <Search/>
        <DropdownList/>
        <DatePicker/>
      </section>
    </div>
  )
}