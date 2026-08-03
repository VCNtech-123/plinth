import request from "supertest";
import app from "../app";

describe("Client Soft Delete Lifecycle", () => {
  it("should soft delete and restore a client correctly", async () => {
    const user = {
      name: "Soft Delete User",
      email: "softdelete@example.com",
      password: "StrongPass123",
    };

    await request(app).post("/api/auth/register").send(user);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    const cookie = login.headers["set-cookie"];

    const createRes = await request(app)
      .post("/api/clients")
      .set("Cookie", cookie)
      .send({
        name: "Lifecycle Client",
        email: "lifecycle@example.com",
      });

    expect(createRes.status).toBe(201);

    const clientId = createRes.body.data.id || createRes.body.data._id;

    // 1. Check list before delete
    const listBeforeDelete = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    // FIX: Safely resolve array regardless of envelope structure
    const clientsBefore = listBeforeDelete.body.data.clients ?? listBeforeDelete.body.data;
    expect(clientsBefore.length).toBe(1);

    // 2. Perform soft delete
    const deleteRes = await request(app)
      .delete(`/api/clients/${clientId}`)
      .set("Cookie", cookie);

    expect(deleteRes.status).toBe(200);

    // 3. Check list after delete
    const listAfterDelete = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    const clientsAfter = listAfterDelete.body.data.clients ?? listAfterDelete.body.data;
    expect(clientsAfter.length).toBe(0);

    // 4. Perform restore
    const restoreRes = await request(app)
      .patch(`/api/clients/${clientId}/restore`)
      .set("Cookie", cookie);

    expect(restoreRes.status).toBe(200);

    // 5. Check list after restore
    const listAfterRestore = await request(app)
      .get("/api/clients")
      .set("Cookie", cookie);

    const clientsRestored = listAfterRestore.body.data.clients ?? listAfterRestore.body.data;
    expect(clientsRestored.length).toBe(1);
  });
});