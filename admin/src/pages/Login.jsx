import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'    // used for API calls
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAToken, backendUrl } = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext)
  const navigate = useNavigate()

  const OnSubmitHandler = async (event) => {    // runs when the form is submitted.. async because API call takes time
    event.preventDefault()          // normally form() causes refresh.. this prevents it

    try {                 // try this code if something happens then use catch
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })    //API call: make the complete URL.. get the email and password from body, and then send it to backend as req.body.email 
        // const{data} to later use data.token and data.message
        if (data.success) {
          localStorage.setItem('aToken', data.token)     // stores token permanently in browser
          setAToken(data.token)       // set atoken to the value
            navigate('/admin-dashboard')  
        }
        else {
          toast.error(data.message)
        }
      }
      else{
        const {data} = await axios.post(backendUrl + '/api/doctor/login', {email,password})
         if (data.success) {
          localStorage.setItem('dToken', data.token)     // stores token permanently in browser
          setDToken(data.token)      // set atoken to the value
           navigate('/doctor-profile')  
          console.log(data.token)
         
        }
        else {
          toast.error(data.message)
        }
      }


    } catch (error) {
      console.log(error.response?.data)      // the  ?. is called optional chaining without it it could crash but with it it returns undefined instead
      toast.error(
        error.response?.data?.message || error.message
      )
    }

  }



  return (


    <form onSubmit={OnSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className='text-2xl font-semibold m-auto'><span className='text-[var(--brand-primary)]'>{state}</span> Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />  {/* Controlled component :: typing->onchange->setstate->state updates*/}
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button type='submit' className='bg-[var(--brand-primary)] text-white w-full py-2 rounded-md text-base cursor-pointer '>Login</button>
        {
          state === 'Admin'
            ? <p>Doctor Login?<span className='text-[var(--brand-primary)] underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
            : <p>Admin Login?<span className='text-[var(--brand-primary)] underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
        }


      </div>
    </form>
  )
}

export default Login