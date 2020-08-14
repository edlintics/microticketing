//This index file ise used to indicate teh app will started on post 3000

import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up ....");

  //CHECK IF ENVIRONMENT VARIABLE IS AVAILABLE
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_Key must be definded");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined");
  }

  // connect to mongodb
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // since we are connect to a container, we need to match the service name and the port
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("Listen on port 3000!!!");
});

start(); // run start function
