import request from "supertest";
import app from "../app";

describe("Project Soft Delete Cascade", () => {
  it("should soft delete a project and cascade delete its tasks", async () => {
    const user = {
      name: "Cascade User",
      email: "cascade@example.com",
      password: "StrongPass123",
    };

    await request(app).post("/api/auth/register").send(user);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    const cookie = login.headers["set-cookie"];

    const clientRes = await request(app)
      .post("/api/clients")
      .set("Cookie", cookie)
      .send({
        name: "Cascade Client",
        email: "cascadeclient@example.com",
      });

    const clientId = clientRes.body.data.id;


    const projectRes = await request(app)
      .post("/api/projects")
      .set("Cookie", cookie)
      .send({
        name: "Cascade Project",
        client: clientId,
      });

    const projectId = projectRes.body.data.id;

    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookie)
      .send({
        title: "Task Under Project",
        project: projectId,
      });

    const taskId = taskRes.body.data.id;

    const deleteProject = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Cookie", cookie);

    expect(deleteProject.status).toBe(200);

    const projectList = await request(app)
      .get("/api/projects")
      .set("Cookie", cookie);

    expect(projectList.body.data.length).toBe(0);

    const taskList = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskList.body.data.length).toBe(0);

    const getTask = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(getTask.status).toBe(404);
  });
});