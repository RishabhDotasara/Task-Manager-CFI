import { Notification } from "@prisma/client";
import { atom } from "recoil";

export const notificationAtom = atom<Notification[]>({
    key: "notificationAtom",
    default: []
});