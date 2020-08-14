// Refactor this code to a seprate file so that we can indicate where the app can run on any ports later in order to test app using supertest library

import express from "express";
import "express-async-errors"; // allow async problem with express when requrie next(), cope with the modern async await
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@edticketing/common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

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

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  // go to link that does not exist in the server
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
