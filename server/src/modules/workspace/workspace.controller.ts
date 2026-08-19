import { Request, Response } from 'express'
import { getCurrentWorkspaceService, getWorkspaceMembersService, inviteUserService, 
         getInvitesService, acceptInviteService, getUserWorkspacesService,
         declineInviteService, setCurrentWorkplaceService, removeMemberService,
         updateWorkspaceService, leaveWorkspaceService, createWorkspaceService
        } from './workspace.service'
import { ApiError } from '../../utils/ApiError'
import { MemberBody, WorkspaceBody, WorkspaceUpdateBody,
         WorkspaceNameBody
 } from './workspace.validation'

export const getCurrentWorkspace = async ( 
    req: Request,
    res: Response
) => {

    const result = await getCurrentWorkspaceService(
        req.user!._id,
        req.workspace!._id
    )

    if (!result) {
        throw new ApiError(404, "No workspace found")
    }

    const { workspace, membersCount, role } = result

    res.status(200).json({
        status: "success",
        data: {
            workspace: {
                id: workspace._id,
                name: workspace.name,
                createdBy: workspace.createdBy
            },
            role,
            membersCount
        }
    })
}

export const getWorkspaceMembers = async (
    req: Request,
    res: Response
) => {

    const members = await getWorkspaceMembersService(req.workspace!._id)

    if (!members) {
        throw new ApiError(404, "No members found")
    }

    res.status(200).json({
        status: "success",  
        results: members.length,
        data: members.map((member) => ({
            id: member._id,
            user: {
                id: member.user._id,
                name: member.user.name,
                email: member.user.email
            },
            role: member.role,
            joinedAt: member.joinedAt,
            status: member.status
        }))
    })
}

export const inviteUser = async (
    req: Request,
    res: Response
) => {
    
    const { body } = res.locals.validated as {
        body: MemberBody
    }

    const { email, role } = body

    const addedMember = await inviteUserService(
        req.workspace!._id,
        email,
        role,
        req.membership!
    )

    res.status(201).json({
        status: "success",
        message: "Member added successfully",
        data: {
            user: {
                id: addedMember.user._id,
                name: addedMember.user.name,
                email: addedMember.user.email
            },
            role: addedMember.role,
            joinedAt: addedMember.joinedAt
            }
        }
    )
}   

export const getInvites = async (
    req: Request,
    res: Response 
) => {

    const invites = await getInvitesService(req.user!._id);

    res.status(200).json({
        status: "success",
        data: invites.map((invite) => ({
                id: invite._id,
                workspace: {
                    id: invite.workspace._id,
                    name: invite.workspace.name,
                    createdBy: invite.workspace.createdBy
                },
               role: invite.role,
               status: invite.status
        }))
    })
}

export const acceptInvite = async (
    req: Request,
    res: Response 
) => {

    const id = req.params.id as string
    const workspace = await acceptInviteService(id, req.user!._id);

    res.status(200).json({
        status: "success",
        message: "Invite accepted",
        data: {
            workspace: {
                id: workspace.workspace._id,
                name: workspace.workspace.name,
                createdBy: workspace.workspace.createdBy
            },
            role: workspace.role,
            joinedAt: workspace.joinedAt
            }
        }
    )
}

export const getUserWorkspaces = async (
    req: Request,
    res: Response
) => {

    const workspaces = await getUserWorkspacesService(req.user!._id)

    if (!workspaces) {
        throw new ApiError(404, "No workspaces found")
    }

    res.status(200).json({
        status: "success",
        results: workspaces.length,
        data: workspaces.map((workspace) => ({
            workspace: {
                id: workspace.workspace._id,
                name: workspace.workspace.name,
                createdBy: workspace.workspace.createdBy
            },
            role: workspace.role,
            joinedAt: workspace.joinedAt
        }))
    })
}


export const declineInvite = async (
    req: Request,
    res: Response 
) => {

    const id = req.params.id as string
    const declinedInvitation = await declineInviteService(id, req.user!._id);

    res.status(200).json({
        status: "declined",
        message: "Invite declined",
        data: {
            id: declinedInvitation._id,
            workspace: {
                id: declinedInvitation.workspace._id,
                name: declinedInvitation.workspace.name,
                createdBy: declinedInvitation.workspace.createdBy
            },
            role: declinedInvitation.role
            }
        }
    )
}

export const setCurrentWorkspace = async (
    req: Request,
    res: Response
) => {

    const { body } = res.locals.validated as {
        body: WorkspaceBody
    }

    const { id } = body

    const workspace = await setCurrentWorkplaceService(
        id,
        req.user!._id
    )

    res.status(200).json({
        status: "success",
        message: "Workspace switched",
        data: {
            workspace: workspace.currentWorkspace
        }
    })
}

export const removeMember = async (req: Request, res: Response) => {
  const membershipId = req.params.id as string;

  const removed = await removeMemberService(
    req.workspace!._id,
    membershipId,
    req.user!._id
  );

  res.status(200).json({
    message: "Member removed",
    data: {
      id: removed!._id,
      status: removed!.status,          
      removedAt: removed!.removedAt,
      removedBy: removed!.removedBy,
      user: removed!.user,              
      role: removed!.role,
    },
  });
};

export const updateWorkspace = async (
    req: Request, 
    res: Response
) => {

    const { body } = res.locals.validated as {
        body: WorkspaceUpdateBody
    }

    const updated = await updateWorkspaceService(
        req.workspace!._id, 
        body
    );

    res.status(200).json({
        status: "success",
        message: "Workspace updated",
        data: {
        id: updated._id,
        name: updated.name,
        },
    });
};

export const leaveWorkspace = async (req: Request, res: Response) => {
  await leaveWorkspaceService(req.workspace!._id, req.user!._id);

  res.status(200).json({
    status: "success",
    message: "Left workspace",
  });
};

export const createWorkspace = async (
    req: Request, 
    res: Response 
) => {

    const { body } = res.locals.validated as {
        body: WorkspaceNameBody
    }

    const { name } =  body

    const membership = await createWorkspaceService(name, req.user!._id)

    res.status(201).json({
    status: "success",
    message: "Workspace created",
    data: {
      workspace: {
        id: membership.workspace._id,
        name: membership.workspace.name,
        createdBy: membership.workspace.createdBy,
      },
      membership: {
        id: membership._id,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt,
      },
    },
  });
}