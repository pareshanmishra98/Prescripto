import mongoose from "mongoose";

const connectDB = async () => {           //function to connect database
    try {      //this means attempt this code

        await mongoose.connect(process.env.MONGODB_URI);     //this line contacts mongodb atlas, authenticates, and opens connection
            //await makes sure the code waits until database is connected.. works only inside async functions
        console.log("Database Connected");

    } catch (error) { //and if any error occurs handle it in the following way
        console.log(error);
    }
};

export default connectDB;