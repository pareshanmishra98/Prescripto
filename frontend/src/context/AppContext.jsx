import { createContext } from "react";
// import { doctors } from "../assets/assets";   // dont need this as we import it using the state variable
import axios from 'axios'
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useState } from "react";

export const AppContext = createContext ()
/*to create context provider function */

const AppContextProvider = (props) => {
    
    const currencySymbol = "$"   // creating a variable to use everytime we need the $ symbol
    const backendUrl = import.meta.env.VITE_BACKEND_URL 
    const [doctors,setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false )
    const [userData, setUserData] = useState(false)
   

    const getDoctorsData = async ()=> {

        try {
            const {data} = await axios.get(backendUrl+ '/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const loadUserProfileData = async ()=>{

        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

     const value = {  /* what ever we add here we can access it in any component */
        doctors, getDoctorsData,
        currencySymbol,// now this can be used everywhere 
        token, setToken,
        backendUrl, 
        userData, setUserData,
        loadUserProfileData
    } 

    useEffect(()=>{
        getDoctorsData()     // this function will be called whenever the page is reloaded
    },[])

    useEffect(()=>{
        if(token){
             loadUserProfileData()     // this function will be called whenever the page is reloaded and the token is available
        }
        else {
            setUserData(false)
        }
       
    },[token])



    return (
         <AppContext.Provider value={value}>
         {props.children}
         </AppContext.Provider>
    )
}

export default AppContextProvider