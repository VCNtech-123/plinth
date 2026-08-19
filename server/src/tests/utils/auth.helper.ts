import request from "supertest";
import app from "../../app";

export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (user: TestUser) => {
  return request(app)
    .post("/api/auth/register")
    .send({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    });
};

export async function loginUser(user: TestUser) {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: user.password });

  return res.headers["set-cookie"];
}

export async function createAndLoginUser(user: TestUser) {
  const reg = await registerUser(user);
  if (reg.status !== 201) {
    throw new Error(`Register failed: ${reg.status} ${JSON.stringify(reg.body)}`);
  }

  const cookie = await loginUser(user);
  if (!cookie) {
    throw new Error(`Login failed: no cookie returned`);
  }

  return cookie;
}