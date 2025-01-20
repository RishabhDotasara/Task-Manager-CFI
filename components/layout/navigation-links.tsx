"use client";
import Link from "next/link";
import {
  Bell,
  FileText,
  List,
  NetworkIcon,
  PresentationIcon,
  Shield,
  Tv2Icon,
} from "lucide-react";
import { FaPeopleCarry, FaTasks } from "react-icons/fa";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import HasPermission from "../permissions/HasPermission";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { useRecoilValue } from "recoil";
import { permissionAtom } from "@/states/permissionAtom";

interface NavLinksProps {
  className?: string;
  iconClassName?: string;
}

export function NavigationLinks({
  className = "",
  iconClassName = "h-4 w-4",
}: NavLinksProps) {
  const userPermissions = useRecoilValue(permissionAtom);

  return (
    <nav className={`grid items-start ${className}`}>
      {
        <Link
          href="/task-manager"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <FaTasks className={iconClassName} />
          Task Manager
        </Link>
      }

      {hasPermission(userPermissions, permissions.team.visible) && (
        <Link
          href="/teams"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <FaPeopleCarry className={iconClassName} />
          My Teams
        </Link>
      )}

      {hasPermission(userPermissions, permissions.club.visible) && (
        <Link
          href="/clubs-manager"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <NetworkIcon className={iconClassName} />
          My Clubs
        </Link>
      )}

      {hasPermission(userPermissions, permissions.admin.admin) && (
        <Link
          href="/manage-admins"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Shield className={iconClassName} />
          Manage Admins
        </Link>
      )}

      {/* {hasPermission(userPermissions, permissions.session.visible) && (
        <Link
          href="/session-scheduler"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Tv2Icon className={iconClassName} />
          My Sessions
        </Link>
      )} */}

      {/* <Link
        href="/session-scheduler"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <PresentationIcon className={iconClassName} />
        Sessions
      </Link */}

      {/* <Link href="/leaderboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <List className={iconClassName} />
        Leader Board
      </Link>
      <Link href="/chats" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <ChatBubbleIcon className={iconClassName} />
        Chats
      </Link>
      <Link href="/documents" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <FileText className={iconClassName} />
        Documents
      </Link> */}
    </nav>
  );
}
