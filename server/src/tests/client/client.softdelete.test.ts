import request from "supertest";
import app from "../../app";
import {
  createAndLoginUser,
  TestUser,
} from "../utils/auth.helper";
import { createClient } from "../utils/client.helper";

describe("Client Soft Delete Lifecycle", () => {
  it("should soft delete and restore a client correctly", async () => {
    const user: TestUser = {
      name: "Soft Delete User",
      email: "softdelete@example.com",
      password: "StrongPass123",
    };

    const cookie = await createAndLoginUser(user);

    const clientId = await createClient(cookie);

    const listBeforeDelete = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    expect(listBeforeDelete.body.data.length).toBe(1);

    const deleteRes = await request(app)
      .delete(`/api/clients/${clientId}`)
      .set("Cookie", cookie);

    expect(deleteRes.status).toBe(200);

    const listAfterDelete = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    expect(listAfterDelete.body.data.length).toBe(0);

    const restoreRes = await request(app)
      .patch(`/api/clients/${clientId}/restore`)
      .set("Cookie", cookie);

    expect(restoreRes.status).toBe(200);

    // ✅ 5. Verify restored
    const listAfterRestore = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    expect(listAfterRestore.body.data.length).toBe(1);
  });
});