import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency ="$"    // it must be in double quotes

    const calculateAge = (dob)=> {

        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age

    }

    const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "sep", "Oct", "Nov", "Dec"]
  //this is to represent the date in the format of date month and year without _ separating them
  const slotDateFormat = (slotDate)=> {
    const dateArray = slotDate.split('_')  // this will give three data.. date month year
    return dateArray[0] + " " + months[Number(dateArray[1])]+ " " + dateArray[2]
  }


    const value ={
        calculateAge, 
        slotDateFormat,
        currency
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider