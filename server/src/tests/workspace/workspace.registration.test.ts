import request from "supertest";
import app from "../../app";
import { Workspace } from "../../modules/workspace/workspace.model";
import { WorkspaceMember } from "../../modules/workspace/workspaceMember.model";
import { User } from "../../modules/user/user.model";
import { TestUser } from "../utils/auth.helper";

describe("Workspace Creation on Registration", () => {
  it("should create a default workspace and membership when user registers", async () => {
    const userData: TestUser = {
      name: "Workspace User",
      email: "workspace@example.com",
      password: "StrongPass123",
    };

    // ✅ Explicit registration request
    const res = await request(app)
    .post("/api/auth/register")
    .send(userData);

    console.log(res.body);

    expect(res.status).toBe(201);
    
    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();

    const workspace = await Workspace.findOne({
      createdBy: user!._id,
    });

    expect(workspace).toBeTruthy();
    expect(workspace!.name).toBe(
      `${userData.name}'s Workspace`
    );

    const membership = await WorkspaceMember.findOne({
      workspace: workspace!._id,
      user: user!._id,
    });

    expect(membership).toBeTruthy();
    expect(membership!.role).toBe("owner");
  });
});