import React, { useContext } from 'react'
import Login from './pages/Login'
 import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AllAppointments from './pages/Admin/AllAppointments';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorsList } from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';



const App = () => {

  const {aToken} = useContext(AdminContext)   //to access the login token for admin
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (                //ternary operator .. if atoken is present then the following happens
    <div className='bg-[#F8F9FD]'> 
      <ToastContainer />                  {/* allows notifications anywhere */}
      <Navbar />            {/* Displays navbar*/}
      <div className='flex items-start'>
          <Sidebar />
          <Routes>        {/* setup the routes for our page */}
            {/* Admin Routes */}
            <Route path='/' element={<></>} /> {/*don't show anything if doctor and admin is logged in */}
             <Route path='/admin-dashboard' element={<Dashboard/>} />
             <Route path='/all-appointments' element={<AllAppointments />} />
             <Route path='/add-doctor' element={<AddDoctor />} />
             <Route path='/doctor-list' element={<DoctorsList />} />
             
             {/* Doctor routes */}
             <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
             <Route path='/doctor-appointments' element={<DoctorAppointments />} />
             <Route path='/doctor-profile' element={<DoctorProfile />} />
             
          </Routes>                                                    
      </div>
    
    </div>
  ) : (                   // if aToken is not present the following happens
    <>                        {/* called a fragment used when we need multiple elements without a div*/}
      <Login />
      <ToastContainer />
    </>
  )
}

export default App