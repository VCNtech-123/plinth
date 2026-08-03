import request from "supertest";
import app from "../app";

describe("Task Soft Delete Lifecycle", () => {
  it("should soft delete and restore a task independently", async () => {
    const user = {
      name: "Task Delete User",
      email: "taskdelete@example.com",
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
        name: "Client T",
        email: "clientt@example.com",
      });

    const clientId = clientRes.body.data.id;

    const projectRes = await request(app)
      .post("/api/projects")
      .set("Cookie", cookie)
      .send({
        name: "Project T",
        client: clientId,
      });

    const projectId = projectRes.body.data.id;

    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Cookie", cookie)
      .send({
        title: "Task T",
        project: projectId,
      });

    const taskId = taskRes.body.data.id;

    const deleteTask = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(deleteTask.status).toBe(200);

    const taskListAfterDelete = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskListAfterDelete.body.data.length).toBe(0);

    const restoreTask = await request(app)
      .patch(`/api/tasks/${taskId}/restore`)
      .set("Cookie", cookie);

    expect(restoreTask.status).toBe(200);

    const taskListAfterRestore = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskListAfterRestore.body.data.length).toBe(1);
  });
});