import { permissionAtom } from "@/states/permissionAtom";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function HasPermission({
  userPermissions,
  permission,
  children,
}: {
  userPermissions:string[],
  permission: string;
  children: React.ReactNode;
}) {
 
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    console.log("User Permissions: "+userPermissions);
    if (userPermissions.includes(permission)) {
      setHasPermission(true);
    }
  }, []);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
