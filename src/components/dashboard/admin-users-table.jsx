"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import AdminUserRow from "@/components/dashboard/admin-user-row";
import ConfirmDialog from "@/components/dashboard/confirm-dialog";
import { useAdminUsers, useUpdateRole, useDeleteUser } from "@/lib/data/hooks";

export default function AdminUsersTable() {
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);

  const [roleTarget, setRoleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pending, setPending] = useState(false);

  const session = authClient.useSession();
  const myId = session.data?.user?.id;

  const { data: usersRes, isPending } = useAdminUsers({ search: applied, page, limit: 10 });
  const updateRole = useUpdateRole();
  const deleteUser = useDeleteUser();

  const items = usersRes?.items ?? [];
  const total = usersRes?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 10));

  async function confirmRoleChange() {
    if (!roleTarget) return;
    try {
      setPending(true);
      await updateRole.mutateAsync({ id: roleTarget.user.id, role: roleTarget.role });
      toast.success(`${roleTarget.user.name || "User"} is now ${roleTarget.role}`);
      setRoleTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not change the role");
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      setPending(true);
      await deleteUser.mutateAsync(deleteTarget.id);
      toast.success("User removed");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not delete the user");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / ALL USERS</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">All users</h1>
          <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
            {total} REGISTERED
          </span>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setApplied(search);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email…"
            aria-label="Search users"
            className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Registered</th>
                <th className="py-3 px-3 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    <Loader2 className="size-4 animate-spin inline mr-2" aria-hidden="true" />
                    Loading users…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    No users match this search.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <AdminUserRow
                    key={user.id}
                    user={user}
                    isSelf={String(user.id) === String(myId)}
                    onRoleChange={(target, role) => setRoleTarget({ user: target, role })}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4 mt-2 text-xs text-muted">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!roleTarget}
        onOpenChange={(open) => !open && setRoleTarget(null)}
        title="Change role?"
        description={
          <>
            Set{" "}
            <span className="font-semibold text-foreground">
              {roleTarget?.user?.name || roleTarget?.user?.email}
            </span>{" "}
            to <span className="font-semibold text-foreground">{roleTarget?.role}</span>? Their dashboard and
            permissions change immediately.
          </>
        }
        confirmLabel="Change role"
        pendingLabel="Saving…"
        pending={pending}
        onConfirm={confirmRoleChange}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove user?"
        description={
          <>
            <span className="font-semibold text-foreground">{deleteTarget?.name || deleteTarget?.email}</span> and
            their sessions will be deleted. This cannot be undone.
          </>
        }
        confirmLabel="Remove user"
        pendingLabel="Removing…"
        pending={pending}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
