import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-41 my-10 ,t-40 text-sm'>
            {/*----------left section---------- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi porro eum nobis veniam nisi beatae magnam a maxime suscipit cupiditate praesentium et dolores quod, officia deserunt sapiente, accusamus eos dignissimos.</p>
            </div>
            {/*----------centre section---------- */}
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/*----------right section---------- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-212-456-7898</li>
                    <li>greatstackdev@gmail.com</li>
                </ul>
            </div>
        </div>
        {/*----------- copyright text -------------- */}
        <div>
            <hr />
            <p className='py- text-sm text-center'>Copyright 2026@ Prescripto - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer