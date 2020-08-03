import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@edticketing/common";

import { Password } from "../services/password";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must apply a password"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid Credential");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    ); // return a  boolean

    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credential");
    }

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! //! is make sure that we know this is not undefined
    );

    //structure: jwt.sign({content want to store}, key )

    // Store it on th session object
    req.session = { jwt: userJwt }; // req.session is the method to allow to store any data inside the cookie session

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
