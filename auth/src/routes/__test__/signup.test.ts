import request from "supertest";
import { app } from "../../app";
import { Password } from "../../services/password";

//Test name

it("return a 201 on successful sign up ", async () => {
  return request(app)
    .post("/api/users/signup") // send a post request to this route
    .send({
      // cpntain these content
      email: "test@test.com",
      password: "password",
    })
    .expect(201); // and expect to receive back this
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "p",
    })
    .expect(400);
});

//Test to avoid duplicate emai

it("disallows duplicate emails", async () => {
  // the first time creation of account should respond sucessfully created
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  // the second time should return an error of 400 as email is duplicated
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

//test if cookies are present when sign in or sign up

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined(); // the response should contain a cookie

  // In order for this test to run, the programm should change cookie session property secure to false
});
