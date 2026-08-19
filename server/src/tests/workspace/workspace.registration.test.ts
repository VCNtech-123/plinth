import request from "supertest";
import app from "../../app";

describe("Auth - Register confirmPassword", () => {
  it("returns 400 when confirmPassword is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass1234",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(String(res.body.message).toLowerCase()).toContain("confirmpassword");
  });

  it("returns 400 when confirmPassword does not match password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test2@example.com",
        password: "StrongPass1234",
        confirmPassword: "StrongPass12345",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(String(res.body.message).toLowerCase()).toContain("passwords do not match");
  });

  it("registers successfully when passwords match", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test3@example.com",
        password: "StrongPass1234",
        confirmPassword: "StrongPass1234",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.email).toBe("test3@example.com");
  });
});