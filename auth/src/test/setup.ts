import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import request from "supertest";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
/* Create an insatance of MongoDb server, allow us to run multiple MongoDb without reaching to the same DB */
beforeAll(async () => {
  //Set the enviroment variables
  process.env.JWT_KEY = "sdsadasd";

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

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  // since jest dont manage cookie, we need to manually supply to the cookie to the vraibel and fetch it back with the request later
  const cookie = response.get("Set-Cookie");

  return cookie;
};
