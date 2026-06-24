import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

//api endpoints


app.use('/api/admin', adminRouter)   //initialize the endpoints using the router in routes folder
// at localhost:4000/api/admin this router will be used... /admin helps access diff endpoints in adminroutes folder
app.use('/api/doctor', doctorRouter)

app.use('/api/user', userRouter)
userRouter.get('/test', (req,res)=>{
    res.send("TEST WORKING")
})
app.get('/',(req,res)=>{
    res.send('API WORKING ')
})
app.listen(port, ()=> console.log("Server Started", port))