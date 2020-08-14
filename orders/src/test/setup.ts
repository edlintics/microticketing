import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock("../nats-wrapper"); // in all teh etst where it call natsWrapper, the mock file will be called in stead of the real one

let mongo: any;
/* Create an insatance of MongoDb server, allow us to run multiple MongoDb without reaching to the same DB */
beforeAll(async () => {
  //Set the enviroment variables
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // hook function, run before everything is setter
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//Before each of our test start

beforeEach(async () => {
  jest.clearAllMocks(); // reset all mock before each test

  /* delete a ll collections before runninning the web app */
  const collections = await mongoose.connection.db.collections(); // get all the currelt collections list

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//after all of the test are run, close the mongodb connection
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/* to avoid future hassel of testing other service that require authetincation, we create a global function
that manage to sign up and check whether we are signed in */

global.signin = () => {
  // Build a JWT payload. {id, email, }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object. {jwt: MY_JWT}
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and decode is as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with teh encoded data
  return [`express:sess=${base64}`];
};
