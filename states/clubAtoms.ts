import { Club } from "@prisma/client";
import { atom } from "recoil";

export const clubAtom = atom<Club[] | null>({
    key:"clubAtom",
    default:null
})