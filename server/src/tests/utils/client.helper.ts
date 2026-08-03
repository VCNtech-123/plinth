import request from "supertest";
import app from "../../app";

export const createClient = async (cookie: string) => {
  const res = await request(app)
    .post("/api/clients")
    .set("Cookie", cookie)
    .send({
      name: "Test Client",
      email: "client@test.com",
    });

  return res.body.data.id;
}