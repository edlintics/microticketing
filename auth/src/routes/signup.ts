import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator"; // express-validator use validate and sanitize the data from the user submit to make sure it comply with the form
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@edticketing/common";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    // validator using express validator
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters "),
  ],
  validateRequest, // run the code inside validate request after

  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // check if there is exitig exist
      // return res.send({});
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save(); // save them to mongodb databse

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! //! is make sure that we know this is not undefined
    );

    //structure: jwt.sign({content want to store}, key )

    // Store it on th session object
    req.session = { jwt: userJwt }; // req.session is the method to allow to store any data inside the cookie session

    res.status(201).send(user);
  }
);

export { router as signupRouter };
