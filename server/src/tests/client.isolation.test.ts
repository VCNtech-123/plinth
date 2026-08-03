import request from "supertest";
import app from "../app";

describe("Client Tenant Isolation", () => {
  it("should prevent one user from accessing another user's client", async () => {
    const userA = {
      name: "User A",
      email: "a@example.com",
      password: "StrongPass123",
    };

    const userB = {
      name: "User B",
      email: "b@example.com",
      password: "StrongPass123",
    };

    // Register users
    await request(app).post("/api/auth/register").send(userA);
    await request(app).post("/api/auth/register").send(userB);

    // Login both users
    const loginA = await request(app)
      .post("/api/auth/login")
      .send({ email: userA.email, password: userA.password });

    const loginB = await request(app)
      .post("/api/auth/login")
      .send({ email: userB.email, password: userB.password });

    const cookieA = loginA.headers["set-cookie"];
    const cookieB = loginB.headers["set-cookie"];

    const clientRes = await request(app)
      .post("/api/clients")
      .set("Cookie", cookieA)
      .send({
        name: "Private Client",
        email: "client@example.com",
      });

    const clientId = clientRes.body.data.id;

    const forbiddenRes = await request(app)
      .get(`/api/clients/${clientId}`)
      .set("Cookie", cookieB);

    expect(forbiddenRes.status).toBe(404);
  });
});