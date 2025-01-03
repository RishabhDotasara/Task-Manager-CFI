import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface AdminTableProps {
  admins: User[];
  onRemoveAdmin: (userId: string) => void;
}

export function AdminTable({ admins, onRemoveAdmin }: AdminTableProps) {
  return (
    <Table className="pl-4">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins && admins?.map((admin) => (
          <TableRow key={admin.userId}>
            <TableCell>{admin.username}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAdmin(admin.userId)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {admins.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No administrators found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}