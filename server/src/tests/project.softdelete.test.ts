import request from "supertest";
import app from "../app";
import {
  createAndLoginUser,
  TestUser,
} from "./utils/auth.helper";
import { createClient } from "./utils/client.helper";
import { createProject } from "./utils/project.helper";
import { createTask } from "./utils/task.helper";

describe("Project Soft Delete Cascade", () => {
  it("should soft delete a project and cascade delete its tasks", async () => {
    const user: TestUser = {
      name: "Cascade User",
      email: "cascade@example.com",
      password: "StrongPass123",
    };

    // ✅ Login user
    const cookie = await createAndLoginUser(user);

    // ✅ Create hierarchy
    const clientId = await createClient(cookie);
    const projectId = await createProject(cookie, clientId);
    const taskId = await createTask(cookie, projectId);

    // ✅ Sanity check — project exists
    const projectBefore = await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Cookie", cookie);

    expect(projectBefore.status).toBe(200);

    // ✅ Sanity check — task exists
    const taskBefore = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(taskBefore.status).toBe(200);

    // ✅ Delete project
    const deleteProject = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Cookie", cookie);

    expect(deleteProject.status).toBe(200);

    // ✅ Project removed from list
    const projectList = await request(app)
      .get("/api/projects")
      .set("Cookie", cookie);

    expect(projectList.body.data.length).toBe(0);

    // ✅ Task removed from list (cascade)
    const taskList = await request(app)
      .get("/api/tasks")
      .set("Cookie", cookie);

    expect(taskList.body.data.length).toBe(0);

    // ✅ Direct task access returns 404
    const getTask = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    expect(getTask.status).toBe(404);
  });
});