import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({    //create a schema
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    image: {type:String, required:true},
    speciality: {type:String, required:true},
    degree: {type:String, required:true},
    experience: {type:String, required:true},
    about: {type:String, required:true},
    available: {type:Boolean, default:true},
    fees: {type:Number, required:true},
    address: {type:Object, required:true},
    date:{type:Number, required:true},
    slots_booked: {type:Object,default:{}}

},{minimize:false})  //the minimize false prevents empty objects being removed automatically by mongoose so that we can get empty info as well from the user

const doctorModel =mongoose.models.doctor || mongoose.model('doctor', doctorSchema) //prevents overwrite errors //create the model.. helps with finding creating and deleting a doctor's info
 
export default doctorModel