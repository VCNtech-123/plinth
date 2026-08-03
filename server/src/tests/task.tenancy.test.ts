import request from "supertest";
import app from "../app";
import {
  createAndLoginUser,
  TestUser,
} from "./utils/auth.helper";
import { createClient } from "./utils/client.helper";
import { createProject } from "./utils/project.helper";
import { createTask } from "./utils/task.helper";

describe("Task Tenant Isolation", () => {
  it("should prevent one user from accessing another user's task", async () => {
    const userA: TestUser = {
      name: "Tenant A",
      email: "tenanta@example.com",
      password: "StrongPass123",
    };

    const userB: TestUser = {
      name: "Tenant B",
      email: "tenantb@example.com",
      password: "StrongPass123",
    };

    // ✅ Create and login both users
    const cookieA = await createAndLoginUser(userA);
    const cookieB = await createAndLoginUser(userB);

    // ✅ User A creates full hierarchy
    const clientId = await createClient(cookieA);
    const projectId = await createProject(cookieA, clientId);
    const taskId = await createTask(cookieA, projectId);

    // ✅ Sanity check — owner can access
    const allowed = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookieA);

    expect(allowed.status).toBe(200);

    // ✅ Non-owner cannot access
    const forbidden = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", cookieB);

    expect(forbidden.status).toBe(404);
  });
});