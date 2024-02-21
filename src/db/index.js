const mongoose = require("mongoose");
const { DB_NAME } = require("../CONSTANT");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1); //Read about them from Node.js documentations
  }
};

module.exports = connectDB;
