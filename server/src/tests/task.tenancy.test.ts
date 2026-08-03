import request from "supertest";
import app from "../app";

describe("Task Tenant Isolation", () => {
  it("should prevent one user from accessing another user's task", async () => {
    const userA = {
      name: "Tenant A",
      email: "tenanta@example.com",
      password: "StrongPass123",
    };

    const userB = {
      name: "Tenant B",
      email: "tenantb@example.com",
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
        email: "clientA@example.com",
      });

    const clientId = clientRes.body.data.id;

    const projectRes = await request(app)
      .post("/api/projects")
      .set("Cookie", cookieA)
      .send({
        name: "Project A",
        client: clientId,
      });

    const projectId = projectRes.body.data.id;

    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookieA)
      .send({
        title: "Secret Task",
        project: projectId,
      });

    const taskId = taskRes.body.data.id;


    const forbidden = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookieB);

    expect(forbidden.status).toBe(404);
  });
});