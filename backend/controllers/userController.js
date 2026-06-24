import validator from 'validator' //to validate the email
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body   //get all the details from the user
        if (!name || !password || !email) {     // check if any is empty
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }
        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()      // this will save the user in the database

        //creating a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for user login

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body   // to get the email and password
        const user = await userModel.findOne({ email })  // find user data using the email

        if (!user) {   //if user does not exist
            return res.json({ success: false, message: 'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password, user.password)   // if the user exists match the password with the database
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)  //create a token for the user to login
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API to get user profile data

const getProfile = async (req, res) => {

    try {
        const userId = req.userId //token will be used to get the userid // to change the header into user id we will need a middleware, authuser.js

        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to update user profile

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body //get that info from the req.body
        const userId = req.userId
        const imageFile = req.file // to get the image file

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }
        //if we have all this info then we will update the user data using these 

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })   //address will be passed as string therefore it is done this way to get the object 

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })  //this will give the image URL
            const imageURL = imageUpload.secure_url  //this will hold the image url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })  //this will update the user data
        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 

const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body    // we will get the docdata using docId
        const userId = req.userId

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor is not available' })
        }
        let slots_booked = docData.slots_booked   //we will get all the booked slots in this variable

        // checking for slots availability

        if (slots_booked[slotDate]) {   // if that slotdate is available
            if (slots_booked[slotDate].includes(slotTime)) {    // if it has the particular time
                return res.json({ success: false, message: "Slot not available" })
            }
            else {
                slots_booked[slotDate].push(slotTime)   // if the slot is not booked we will add it to the array of booked slots
            }
        } else {            //if a date has no bookings then we will created a slotdate and a slotitme for that booking
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        const newAppointment = new appointmentModel(appointmentData)

        await newAppointment.save()   //new appointment will be saved in the database

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })  // update the doctor slots using the slots_booked variable
        res.json({ success: true, message: 'Appointment booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to cancel appointment
const cancelAppointment = async (req, res) => {

    try {

        const { appointmentId } = req.body
        const userId = req.userId

        const appointmentData = await appointmentModel.findById(appointmentId)

        //verify appointment user.. as in if the appointment belongs to the particular user he can cancel it

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorised action' })
        }

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

//this is to create an instance of razorpay the id and secret we will get form the razorpay website
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay


//we need to add a script line into the index.html file from the razorpay integration steps
const paymentRazorPay = async (req, res) => {

    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment cancelled or not found' })
        }

        // creating options for razorpay payment 
            
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        //creation of an order
        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

//API to verify payment of razorpay 

const verifyRazorpay = async (req,res)=>{

    try {
        const {razorpay_order_id} =req.body // get the id from console 
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    
        // we will check if status is paid we will find the appointment using appointment id which we gave in receipt and we will mark the payment true
        if(orderInfo.status ==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})   //we will find and update the payment to true
            res.json({success:true,message:"Payment successful"})
        }
        else{
            res.json({success:false,message:"Payment failed"})
        }


        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorPay, verifyRazorpay}