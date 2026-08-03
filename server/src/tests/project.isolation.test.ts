import request from "supertest";
import app from "../app";

describe("Project Tenant Isolation", () => {
  it("should prevent one user from accessing another user's project", async () => {
    const userA = {
      name: "User A",
      email: "projA@example.com",
      password: "StrongPass123",
    };

    const userB = {
      name: "User B",
      email: "projB@example.com",
      password: "StrongPass123",
    };

    await request(app).post("/api/auth/register").send(userA);
    await request(app).post("/api/auth/register").send(userB);

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
        name: "Client A",
        email: "clienta@example.com",
      });

    const clientId = clientRes.body.data.id;

    const projectRes = await request(app)
      .post("/api/projects")
      .set("Cookie", cookieA)
      .send({
        name: "Secret Project",
        client: clientId,
      });

    const projectId = projectRes.body.data.id;

    const forbidden = await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Cookie", cookieB);

    expect(forbidden.status).toBe(404);
  });
});