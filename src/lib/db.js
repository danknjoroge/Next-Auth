import mongoose from "mongoose";

const dbConnection = async () => {
    if(mongoose.connection.readyState) return;

    try {
        await mongoose.connect(process.env.MONGO_URI,{
           useNewUrlParser:true,
           useUnifiedTopology:true
        })
        console.log("Successfully Connected");
        
    } catch (error) {
        console.log("Error connecting....");
        
        throw new Error('Error Connecting...')
    }
}

export default dbConnection