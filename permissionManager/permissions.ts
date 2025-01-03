import { PrismaClient } from "@prisma/client";

export const permissions = {
  task: {
    create: (teamId: string) => `task:create:${teamId}`,
    read: (teamId: string) => `task:read:${teamId}`,
    update: (teamId: string) => `task:update:${teamId}`,
    delete: (teamId: string) => `task:delete:${teamId}`,
    readAll: (teamId:string) => `task:readAll:${teamId}`, // For admins
  },
  team: {
    create: "team:create",
    read: (teamId: string) => `team:read:${teamId}`,
    update: (teamId: string) => `team:update:${teamId}`,
    delete: (teamId: string) => `team:delete:${teamId}`,
    readAll: "team:readAll", // For admins
  },
  admin:{
    admin:"admin:admin"
  }
};

// Default Permissions
export const defaultPermissions = (teamIds: string[]) => ({
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
    permissions.task.readAll(teamId),
    permissions.team.read(teamId),
  ]),
  TEAMLEADER: teamIds.flatMap((teamId) => [
    permissions.task.delete(teamId),
    permissions.task.create(teamId),
    permissions.task.delete(teamId),
    permissions.team.update(teamId),
  ]),
});

// Check Permissions
export function hasPermission(
  userPermissions: string[],
  permission: string
): boolean {
  return userPermissions.some(
    (userPermission) =>
      userPermission === permission ||
      userPermission.startsWith(permission + ":") || userPermission === "admin:admin"
  );
}


export async function getDynamicPermissions(teams:any[], teamLeads:any[])
{
  try 
  { 
    const genPermissions:string[] = [];
    teamLeads.forEach((team:any)=>{
      genPermissions.push(...defaultPermissions([team.teamId])["TEAMLEADER"])
    })
    teams.forEach((team:any)=>{
      genPermissions.push(...defaultPermissions([team.teamId])["MEMBER"])
    })
    return genPermissions
  } 
  catch(err)
  {
    console.log("ERROR Generating Permissions:", err);
  }

}
