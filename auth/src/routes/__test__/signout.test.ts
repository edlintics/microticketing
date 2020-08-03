import request from "supertest";
import { app } from "../../app";

it("clears teh cookies after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);
  // check what is the supposed repsone when return an empty cookie
  console.log(response.get("Set-Cookie"));

  //The response:
  // console.log
  //     [
  //       'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  //     ]

  //Thus, we expect the same response in test case
  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
