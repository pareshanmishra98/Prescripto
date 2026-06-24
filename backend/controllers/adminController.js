import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

// API for adding doctor

 export const addDoctor= async(req,res)=> {  //use req,res as parameters.. already provided by express
    try {
        const{name,email,password,speciality,degree,experience,about,fees,address} = req.body //automatically extracts values
        //called destructuring.. helps create diff variables with the requests information
        const imageFile=req.file
       //checking for all data to add doctor
        if (!name||!email||!password|| !speciality|| !degree || !experience|| !about|| !fees || !address ) {
            return res.json({success:false,message: "Missing Details"})
        }
        // validating email format
        if (!validator.isEmail(email)) {
return res.json({success:false,message: "Please enter a valid email"})
        }

        //validating strong password
        if (password.length<8) {
            return res.json({success:false,message: "Please enter a strong password"})
        }

        //hashing doctor password by generating a salt
        const salt = await bcrypt.genSalt(10)   // the more the number the longer the time to encrypt the password from 5 to 15
        // salt is random addition before hashing 
        //prevents same hashing for same pswd
        //10 is called the cost or work factor
        const hashedPassword = await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload= await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        //in imageUpload variable we will get one link
        const imageUrl = imageUpload.secure_url  // we get the cloudinary image URL

        // now we have all the data and we will save it in our database
        const doctorData={
            name,
            email,
            image:imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),    // we need to parse the data to store the address as an object
            date:Date.now()
        }
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()  //to save the data
        return res.json({success:true, message:"Doctor added"})


    } catch (error) {
        console.log(error)
        return res.json({success:false, message:error.message})
    }
}

// API for admin login
export const loginAdmin = async(req,res) => {
    try {


        const {email,password}=req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            console.log(email,password)
            const token = jwt.sign({email,password},process.env.JWT_SECRET)  // This will get us a token
           return res.json({success:true,token})
        } 
        else {
           return res.json({success:false, message: "Invalid credentials"})
        }

    } catch (error) {
        console.log(error)
       return res.json({success:false, message:error.message})
    }
}

// API to get all doctors list for dashboard in admin panel

export const allDoctors = async (req,res) => {
     try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})


     } catch (error) {
        console.log(error)
       return res.json({success:false, message:error.message})
     }

}

// API to get all appointments list 

export const appointmentsAdmin = async(req,res) =>{
    try {
        const appointments = await appointmentModel.find({}) // as it is empty it will save all the appointments in the appointments variable
        res.json({success:true, appointments})

    } catch (error) {
          console.log(error)
       return res.json({success:false, message:error.message})
    }
}

// API to cancel appointment 

export const appointmentCancel = async (req, res) => {

    try {

        const { appointmentId } = req.body
     

        const appointmentData = await appointmentModel.findById(appointmentId)


        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
        // now to make that slot free..
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)  // if this slot is not the same as selected slot it will be here
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel 

export const adminDashboard = async (req,res)=>{

    try {

        const doctors = await doctorModel.find({}) // access all the doctors
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        // find the number of all of the above

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments : appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}
