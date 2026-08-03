import request from "supertest";
import app from "../app";
import {
  createAndLoginUser,
  TestUser,
} from "./utils/auth.helper";
import { createClient } from "./utils/client.helper";
import { createProject } from "./utils/project.helper";
import { createTask } from "./utils/task.helper";

describe("Task Soft Delete Lifecycle", () => {
  it("should soft delete and restore a task independently", async () => {
    const user: TestUser = {
      name: "Task Delete User",
      email: "taskdelete@example.com",
      password: "StrongPass123",
    };

    // ✅ Login
    const cookie = await createAndLoginUser(user);

    // ✅ Create hierarchy
    const clientId = await createClient(cookie);
    const projectId = await createProject(cookie, clientId);
    const taskId = await createTask(cookie, projectId);

    // ✅ Sanity check — task exists
    const taskBefore = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(taskBefore.status).toBe(200);

    // ✅ Soft delete task
    const deleteTask = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(deleteTask.status).toBe(200);

    // ✅ Ensure removed from list
    const taskListAfterDelete = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskListAfterDelete.body.data.length).toBe(0);

    // ✅ Restore task
    const restoreTask = await request(app)
      .patch(`/api/tasks/${taskId}/restore`)
      .set("Cookie", cookie);

    expect(restoreTask.status).toBe(200);

    // ✅ Ensure restored
    const taskListAfterRestore = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskListAfterRestore.body.data.length).toBe(1);
  });
});