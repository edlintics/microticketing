// Refactor this code to a seprate file so that we can indicate where the app can run on any ports later in order to test app using supertest library

import express from "express";
import "express-async-errors"; // allow async problem with express when requrie next(), cope with the modern async await
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@edticketing/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set("trust proxy", true); // make sure it trust traffic from ingress engine
app.use(json());
app.use(
  cookieSession({
    signed: false, // no encryption
    // secure: process.env.NODE_ENV !== "test", // set this to to true in normal https reuest, in test environment, change to false
    secure: false, // in deployment mode
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async (req, res) => {
  // go to link that does not exist in the server
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
