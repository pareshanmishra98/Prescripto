import Banner from "../components/Banner"
import Header from "../components/Header"
import SpecialityMenu from "../components/specialityMenu"
import TopDoctors from "../components/TopDoctors"

const Home = () => {
  return (
    <div>
      <Header />  {/* to mount the header.jsx on the home page */}
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    
    </div>
  )
}

export default Home
