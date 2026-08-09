import { IUser } from "../modules/user/user.model";
import { IWorkspace } from "../modules/workspace/workspace.model";
import { IWorkspaceMember } from "../modules/workspace/workspaceMember.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            workspace?: IWorkspace;
            membership?: IWorkspaceMember;
        }
    }
}