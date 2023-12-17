import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const DatabaseResponse = await mongoose.connect(process.env.MONGODB_URI);
    console.log("database Connected Successfully!");
    console.log(DatabaseResponse.connection.host);
  } catch (error) {
    console.log("DataBase Error", error);
    process.exit(1);
  }
};
export default connectDB;