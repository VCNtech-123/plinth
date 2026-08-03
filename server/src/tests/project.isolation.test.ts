import request from "supertest";
import app from "../app";
import {
  createAndLoginUser,
  TestUser,
} from "./utils/auth.helper";
import { createClient } from "./utils/client.helper";
import { createProject } from "./utils/project.helper";

describe("Project Tenant Isolation", () => {
  it("should prevent one user from accessing another user's project", async () => {
    const userA: TestUser = {
      name: "User A",
      email: "projA@example.com",
      password: "StrongPass123",
    };

    const userB: TestUser = {
      name: "User B",
      email: "projB@example.com",
      password: "StrongPass123",
    };

    const cookieA = await createAndLoginUser(userA);
    const cookieB = await createAndLoginUser(userB);


    const clientId = await createClient(cookieA);

    // ✅ User A creates project
    const projectId = await createProject(cookieA, clientId);

    // ✅ User B tries to access it
    const forbidden = await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Cookie", cookieB);

    expect(forbidden.status).toBe(404);
  });
});