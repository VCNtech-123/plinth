import request from "supertest";
import app from "../../app";

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (user: TestUser) => {
  return request(app).post("/api/auth/register").send(user);
}

export async function loginUser(user: TestUser) {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: user.password });

  return res.headers["set-cookie"];
}

export async function createAndLoginUser(user: TestUser) {
  await registerUser(user);
  return loginUser(user);
}