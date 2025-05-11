import Header from "../components/header"
import Dashboard from "../components/dashboard"

export default function Home() {
  return(
    <span className="bg-gray-700 w-full h-full flex flex-col gap-3">
      <Header/>
      <Dashboard/>
    </span>
  )
}
