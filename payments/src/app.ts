// Refactor this code to a seprate file so that we can indicate where the app can run on any ports later in order to test app using supertest library

import express from "express";
import "express-async-errors"; // allow async problem with express when requrie next(), cope with the modern async await
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@edticketing/common";

import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // make sure it trust traffic from ingress engine
app.use(json());

app.use(
  cookieSession({
    signed: false, // no encryption
    secure: process.env.NODE_ENV !== "test", // set this to to true in normal https reuest, in test environment, change to false
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  // go to link that does not exist in the server
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
