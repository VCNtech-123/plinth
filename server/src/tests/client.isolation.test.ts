import request from "supertest";
import app from "../app";
import {
  createAndLoginUser,
  TestUser,
} from "./utils/auth.helper";
import { createClient } from "./utils/client.helper";

describe("Client Tenant Isolation", () => {
  it("should prevent one user from accessing another user's client", async () => {
    const userA: TestUser = {
      name: "User A",
      email: "a@example.com",
      password: "StrongPass123",
    };

    const userB: TestUser = {
      name: "User B",
      email: "b@example.com",
      password: "StrongPass123",
    };

    // ✅ Create & login users
    const cookieA = await createAndLoginUser(userA);
    const cookieB = await createAndLoginUser(userB);

    // ✅ User A creates client
    const clientId = await createClient(cookieA);

    // ✅ User B tries to access it
    const forbiddenRes = await request(app)
      .get(`/api/clients/${clientId}`)
      .set("Cookie", cookieB);

    expect(forbiddenRes.status).toBe(404);
  });
});