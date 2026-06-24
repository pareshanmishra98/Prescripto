//purpose:: this connects the URL to controller

import express from 'express'
import { addDoctor , adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import { authAdmin } from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter=express.Router()        //creates mini router 
 
adminRouter.post('/add-doctor' ,upload.single('image'), authAdmin,addDoctor)  //we are sending data fo creation of a doctor
//.post means accept POST request(sending req)// /add-doctor is the API endpoint // upload.single('image') means that a single image can be uploaded
//req.file gets image.. not possible without multer
//after middleware finishes the addDoctor controller runs
adminRouter.post('/login',loginAdmin) 
adminRouter.post('/all-doctors',authAdmin, allDoctors) 
adminRouter.post('/change-availability',authAdmin, changeAvailability) 
adminRouter.get('/appointments', authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel )
adminRouter.get('/dashboard', authAdmin,adminDashboard)
export default adminRouter