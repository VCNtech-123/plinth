import request from "supertest";
import  app  from "../app";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });
});