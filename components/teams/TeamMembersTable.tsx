import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { User } from '@prisma/client'



type TeamMembersTableProps = {
  title: string
  members: User[]
  role: string
}

export function TeamMembersTable({ title, members, role }: TeamMembersTableProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll No.</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>{member.username}</TableCell>
              <TableCell className="font-mono uppercase">{member.employeeId}</TableCell>
              <TableCell>{role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}