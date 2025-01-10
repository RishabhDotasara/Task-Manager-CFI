import { Club, PrismaClient, Team } from "@prisma/client";

export const permissions = {
  task: {
    create: (teamId: string) => `task:create:${teamId}`,
    read: (teamId: string) => `task:read:${teamId}`,
    update: (teamId: string) => `task:update:${teamId}`,
    delete: (teamId: string) => `task:delete:${teamId}`,
    readAll: (teamId: string) => `task:readAll:${teamId}`, // For admins
  },
  team: {
    create: "team:create",
    read: (teamId: string) => `team:read:${teamId}`,
    update: (teamId: string) => `team:update:${teamId}`,
    delete: (teamId: string) => `team:delete:${teamId}`,
    visible: "team:visible",
    readAll: "team:readAll", // For admins
    createSession: (teamId:string)=>`team:create:session:${teamId}`
  },
  admin: {
    admin: "admin:admin",
  },
  club:{
    visible:"club:visible",
    create:"club:create"
  },
  session:{
    visible:"session:visible",
  }
};

// Default Permissions
export const defaultPermissions = (teamIds: string[], clubIds: string[] = []) => ({
  ADMIN: [
    permissions.task.readAll,
    permissions.team.readAll,
    ...teamIds.flatMap((teamId) => [
      permissions.task.create(teamId),
      permissions.task.read(teamId),
      permissions.task.update(teamId),
      permissions.task.delete(teamId),
      permissions.team.read(teamId),
    ]),
  ],
  MEMBER: teamIds.flatMap((teamId) => [
    permissions.task.read(teamId),
    permissions.task.update(teamId),
    permissions.team.read(teamId),
    permissions.session.visible
  ]),
  TEAMLEADER: teamIds.flatMap((teamId) => [
    permissions.task.delete(teamId),
    permissions.task.create(teamId),
    permissions.task.delete(teamId),
    permissions.team.update(teamId),
    permissions.team.visible,
    permissions.team.createSession(teamId)
  ]),
  CLUBLEADER: teamIds.flatMap((teamId)=>[
    permissions.team.create,
    permissions.team.update(teamId),
    permissions.team.delete(teamId),
    permissions.club.visible
  ])

});

// Check Permissions
export function hasPermission(
  userPermissions: string[],
  permission: string
): boolean {
  return userPermissions.some(
    (userPermission) =>
      userPermission === permission || userPermission == permissions.admin.admin
  );
}

export async function getDynamicPermissions(teams: any[], teamLeads: any[], clubTeams:any[]) {
  try {
    const genPermissions: string[] = [];
    teamLeads.forEach((team: any) => {
      genPermissions.push(...defaultPermissions([team.teamId])["TEAMLEADER"]);
    });
    teams.forEach((team: any) => {
      genPermissions.push(...defaultPermissions([team.teamId])["MEMBER"]);
    });
    clubTeams.forEach((team:Team)=>{
      genPermissions.push(...defaultPermissions([team.teamId])["CLUBLEADER"]);
    })

    return genPermissions;
  } catch (err) {
    console.log("ERROR Generating Permissions:", err);
  }
}
