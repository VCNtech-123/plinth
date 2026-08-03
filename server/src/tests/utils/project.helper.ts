import request from "supertest";
import app from "../../app";

export const createProject = async (
  cookie: string,
  clientId: string
) => {
  const res = await request(app)
    .post("/api/projects")
    .set("Cookie", cookie)
    .send({
      name: "Test Project",
      client: clientId,
    });

  return res.body.data.id;
}