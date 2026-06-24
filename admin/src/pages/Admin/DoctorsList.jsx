import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { useEffectEvent } from 'react'

export const DoctorsList = () => {

  const{doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {   // it will work when the thing inside [] changes which is called the dependency array
    if(aToken){
      getAllDoctors()
    }

  }, [aToken]) // useEffect will work when the thing inside [] changes
    
  


  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key = {index}> {/*The state of this element will affect its children because we have used the group */}
              <img className='bg-indigo-0 group-hover:bg-[var(--brand-primary)] transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-60 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={()=> changeAvailability(item._id)} type="checkbox"  checked={item.available}/> {/*checked if the item.available is true*/}
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
