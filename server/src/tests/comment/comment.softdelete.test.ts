import request from "supertest";
import app from "../../app";
import {
  createAndLoginUser,
  TestUser,
} from "../utils/auth.helper";
import { createClient } from "../utils/client.helper";
import { createProject } from "../utils/project.helper";
import { createTask } from "../utils/task.helper";

describe("Comment Soft Delete Lifecycle", () => {
  it("should soft delete and restore a comment correctly", async () => {
    const user: TestUser = {
      name: "Comment User",
      email: "comment@example.com",
      password: "StrongPass123",
    };

    const cookie = await createAndLoginUser(user);

    const clientId = await createClient(cookie);
    const projectId = await createProject(cookie, clientId);
    const taskId = await createTask(cookie, projectId);

    // ✅ Create comment
    const createRes = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookie)
      .send({ content: "Temporary comment" });

    expect(createRes.status).toBe(201);

    const commentId = createRes.body.data.id;

    // ✅ Ensure it appears
    const listBefore = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookie);

    expect(listBefore.body.results).toBe(1);

    // ✅ Soft delete
    const deleteRes = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Cookie", cookie);

    expect(deleteRes.status).toBe(200);

    // ✅ Should not appear anymore
    const listAfterDelete = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookie);

    expect(listAfterDelete.body.results).toBe(0);

    // ✅ Restore
    const restoreRes = await request(app)
      .patch(`/api/comments/${commentId}/restore`)
      .set("Cookie", cookie);

    expect(restoreRes.status).toBe(200);

    // ✅ Should appear again
    const listAfterRestore = await request(app)
      .get(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookie);

    expect(listAfterRestore.body.results).toBe(1);
  });

  it("should not allow commenting on a soft-deleted task", async () => {
    const user: TestUser = {
      name: "Soft Task User",
      email: "softtask@example.com",
      password: "StrongPass123",
    };

    const cookie = await createAndLoginUser(user);

    const clientId = await createClient(cookie);
    const projectId = await createProject(cookie, clientId);
    const taskId = await createTask(cookie, projectId);

    // ✅ Delete task
    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", cookie);

    // ❌ Try commenting
    const res = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Cookie", cookie)
      .send({ content: "Should fail" });

    expect(res.status).toBe(404);
  });
});