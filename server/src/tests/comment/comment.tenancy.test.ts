import request from "supertest";
import app from "../../app";
import {
  createAndLoginUser,
  TestUser,
} from "../utils/auth.helper";
import { createClient } from "../utils/client.helper";
import { createProject } from "../utils/project.helper";
import { createTask } from "../utils/task.helper";

describe("Comment Tenancy Isolation", () => {
  it("should not allow a user to comment on another user's task", async () => {

    const userA: TestUser = {
      name: "User A",
      email: "usera@example.com",
      password: "StrongPass123",
    };

    const cookieA = await createAndLoginUser(userA);

    const clientId = await createClient(cookieA);
    const projectId = await createProject(cookieA, clientId);
    const taskId = await createTask(cookieA, projectId);

    const userB: TestUser = {
      name: "User B",
      email: "userb@example.com",
      password: "StrongPass123",
    };

    const cookieB = await createAndLoginUser(userB);

    const res = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookieB)
      .send({ content: "Hacked!" });

    expect(res.status).toBe(404);
  });
});