import request from "supertest";
import app from "../../app";

export const createTask = async (
  cookie: string[],
  projectId: string
) => {
  const res = await request(app)
    .post("/api/tasks")
    .set("Cookie", cookie)
    .send({
      title: "Test Task",
      project: projectId,
    });

  return res.body.data.id;
}