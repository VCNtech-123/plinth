
import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const newUser = {
      name: "Test User",
      email: "test@example.com",
      password: "StrongPass123",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.email).toBe(newUser.email);
    expect(res.body.data).toHaveProperty("id");
  });

  it("should login and set auth cookie", async () => {
  const user = {
    name: "Test User",
    email: "login@example.com",
    password: "StrongPass123",
  };

  await request(app)
    .post("/api/auth/register")
    .send(user);

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  expect(res.status).toBe(200);
  expect(res.headers["set-cookie"]).toBeDefined();
});
});