"use client";

import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/components/layout/user-menu";
import { formatDate } from "@/lib/money";

const ROLES = ["customer", "owner", "admin"];

export default function AdminUserRow({ user, isSelf, onRoleChange, onDelete }) {
  return (
    <tr className="hover:bg-raised/40 transition-colors">
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
              {initialsOf(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">{user.name || "—"}</span>
        </div>
      </td>
      <td className="py-3.5 px-3 text-muted">{user.email}</td>
      <td className="py-3.5 px-3">
        <select
          value={user.role}
          disabled={isSelf}
          aria-label={`Role for ${user.name || user.email}`}
          onChange={(event) => onRoleChange(user, event.target.value)}
          className="rounded-[8px] border border-border bg-raised px-2.5 py-1 text-xs text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {isSelf && <p className="mt-1 font-mono text-[10px] text-muted">you</p>}
      </td>
      <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
        {user.createdAt ? formatDate(user.createdAt) : "—"}
      </td>
      <td className="py-3.5 px-3 text-right">
        <button
          type="button"
          disabled={isSelf}
          onClick={() => onDelete(user)}
          aria-label={`Remove ${user.name || user.email}`}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-danger/40 px-2.5 py-1 text-xs text-danger hover:bg-danger/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="size-3" aria-hidden="true" />
          Remove
        </button>
      </td>
    </tr>
  );
}
