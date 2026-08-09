import request from "supertest";
import app from "../../app";
import {
  registerUser,
  loginUser,
  createAndLoginUser,
  TestUser,
} from "../utils/auth.helper";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const newUser: TestUser = {
      name: "Test User",
      email: "test@example.com",
      password: "StrongPass123",
    };

    const res = await registerUser(newUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.email).toBe(newUser.email);
    expect(res.body.data).toHaveProperty("id");
  });

  it("should login and set auth cookie", async () => {
    const user: TestUser = {
      name: "Test User",
      email: "login@example.com",
      password: "StrongPass123",
    };

    await registerUser(user);

    const cookie = await loginUser(user);

    expect(cookie).toBeDefined();
  });
});