import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Shared/Navbar'
import Footer from '../Components/Shared/Footer'

const MainLayout = () => {
  return (
    <div className='bg-white'>
      <Navbar />
      {/* pt-24  */}
      <div className='min-h-[calc(100vh-228px)]'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
