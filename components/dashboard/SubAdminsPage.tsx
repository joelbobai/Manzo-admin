"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getResponseErrorMessage, parseJSON } from "@/lib/http";
import { useAuth } from "@/stores/auth-store";

type ApiSubAdmin = {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  status?: "active" | "inactive";
  canIssueTickets?: boolean;
  canReserveTickets?: boolean;
  canRetrieveTickets?: boolean;
  canCancelTickets?: boolean;
  reservedTickets?: string[];
};

export type SubAdmin = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  canIssueTickets: boolean;
  canReserveTickets: boolean;
  canRetrieveTickets: boolean;
  canCancelTickets: boolean;
  reservedTickets: string[];
};

type PermissionKey =
  | "canIssueTickets"
  | "canReserveTickets"
  | "canRetrieveTickets"
  | "canCancelTickets";

function normalizeSubAdmin(payload: ApiSubAdmin): SubAdmin | null {
  const id = payload.id ?? payload._id;
  if (!id) {
    return null;
  }

  return {
    id,
    name: payload.fullName ?? payload.name ?? "Unknown user",
    email: payload.email ?? "",
    isActive: payload.isActive ?? payload.status !== "inactive",
    canIssueTickets: payload.canIssueTickets ?? false,
    canReserveTickets: payload.canReserveTickets ?? false,
    canRetrieveTickets: payload.canRetrieveTickets ?? false,
    canCancelTickets: payload.canCancelTickets ?? false,
    reservedTickets: Array.isArray(payload.reservedTickets)
      ? payload.reservedTickets.map(String)
      : [],
  };
}

export default function SubAdminsPage() {
  const { authFetch, hydrated, user } = useAuth();
  const isMainAdmin = user?.role === "main_admin";
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [createFullName, setCreateFullName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPermissions, setCreatePermissions] = useState<Record<PermissionKey, boolean>>({
    canIssueTickets: false,
    canReserveTickets: false,
    canRetrieveTickets: false,
    canCancelTickets: false,
  });
  const [createStatus, setCreateStatus] = useState<"idle" | "success" | "error">("idle");
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const searchResult = useMemo(() => {
    if (!searchId) return null;
    const match = subAdmins.find((admin) => admin.id.toLowerCase() === searchId.toLowerCase());
    return match ?? null;
  }, [searchId, subAdmins]);

  const applyRemoteSubAdmin = (payload: ApiSubAdmin, fallbackId?: string) => {
    const normalized = normalizeSubAdmin({ ...payload, id: payload.id ?? payload._id ?? fallbackId });
    if (!normalized) return;

    setSubAdmins((previous) => {
      const exists = previous.some((admin) => admin.id === normalized.id);
      if (!exists) {
        return [...previous, normalized];
      }

      return previous.map((admin) => (admin.id === normalized.id ? normalized : admin));
    });
  };

  const fetchSubAdmins = useCallback(async () => {
    if (!hydrated) return;
    setLoading(true);
    setError(null);

    try {
      const query = activeSearch ? `?search=${encodeURIComponent(activeSearch)}` : "";
      const response = await authFetch(`/api/v1/user/subadmins${query}`, { method: "GET" });
      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<ApiSubAdmin[]>(response);
      const normalized = Array.isArray(payload)
        ? payload.map(normalizeSubAdmin).filter((item): item is SubAdmin => Boolean(item))
        : [];
      setSubAdmins(normalized);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load sub-admins.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, authFetch, hydrated]);

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  const createSubAdmin = async () => {
    setCreateStatus("idle");
    setCreateMessage(null);
    setCreating(true);

    try {
      const response = await authFetch("/api/v1/user/subadmin/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: createFullName,
          email: createEmail,
          password: createPassword,
          // isActive: true,
          // ...createPermissions,
        }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<ApiSubAdmin>(response);
      applyRemoteSubAdmin(payload);
      setCreateStatus("success");
      setCreateMessage("Sub-admin account created.");
      setCreateFullName("");
      setCreateEmail("");
      setCreatePassword("");
      setCreatePermissions({
        canIssueTickets: false,
        canReserveTickets: false,
        canRetrieveTickets: false,
        canCancelTickets: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create the sub-admin.";
      setCreateStatus("error");
      setCreateMessage(message);
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (adminId: string, isActive: boolean) => {
    setUpdating((previous) => ({ ...previous, [adminId]: true }));
    setError(null);

    try {
      const response = await authFetch(`/api/v1/user/subadmins/${adminId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<ApiSubAdmin>(response);
      applyRemoteSubAdmin(payload, adminId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update the sub-admin.";
      setError(message);
    } finally {
      setUpdating((previous) => ({ ...previous, [adminId]: false }));
    }
  };

  const updatePermissions = async (adminId: string, changes: Partial<Record<PermissionKey, boolean>>) => {
    setUpdating((previous) => ({ ...previous, [adminId]: true }));
    setError(null);

    try {
      const response = await authFetch(`/api/v1/user/subadmins/${adminId}/permissions`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }

      const payload = await parseJSON<ApiSubAdmin>(response);
      const payloadWithFallback: ApiSubAdmin = { ...payload };

      for (const [key, value] of Object.entries(changes) as [PermissionKey, boolean][]) {
        if (payloadWithFallback[key] === undefined) {
          payloadWithFallback[key] = value;
        }
      }

      applyRemoteSubAdmin(payloadWithFallback, adminId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update permissions.";
      setError(message);
    } finally {
      setUpdating((previous) => ({ ...previous, [adminId]: false }));
    }
  };

  const resetPassword = async (adminId: string) => {
    setUpdating((previous) => ({ ...previous, [adminId]: true }));
    setError(null);

    try {
      const response = await authFetch(`/api/v1/user/subadmins/${adminId}/reset-password`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await getResponseErrorMessage(response));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reset the sub-admin password.";
      setError(message);
    } finally {
      setUpdating((previous) => ({ ...previous, [adminId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Users</p>
        <h1 className="text-2xl font-semibold text-slate-900">Manage sub-admin access</h1>
        <p className="text-sm text-slate-500">
          Deactivate accounts or toggle ticket permissions for every sub-admin. Search by ID to review the tickets
          they have reserved.
        </p>
        {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
        <form
          className="mt-4 flex flex-col gap-3 md:flex-row md:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            setActiveSearch(searchTerm.trim());
          }}
        >
          <div className="flex flex-1 flex-wrap gap-3 md:flex-nowrap">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or email"
              className="min-w-0 flex-1"
            />
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Button>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={fetchSubAdmins} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh list"}
          </Button>
        </form>
      </header>

      {isMainAdmin ? (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">User management</p>
              <h2 className="text-xl font-semibold text-slate-900">Create a sub-admin</h2>
              <p className="text-sm text-slate-500">
                Issue credentials and assign permissions for new sub-admins.
              </p>
            </div>
          </div>
          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              createSubAdmin();
            }}
          >
            <div className="space-y-2">
              <label htmlFor="createFullName" className="text-sm font-medium text-slate-700">
                Full name
              </label>
              <Input
                id="createFullName"
                value={createFullName}
                onChange={(event) => setCreateFullName(event.target.value)}
                placeholder="Amina Sule"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="createEmail" className="text-sm font-medium text-slate-700">
                Work email
              </label>
              <Input
                id="createEmail"
                type="email"
                value={createEmail}
                onChange={(event) => setCreateEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="createPassword" className="text-sm font-medium text-slate-700">
                Temporary password
              </label>
              <Input
                id="createPassword"
                type="password"
                value={createPassword}
                onChange={(event) => setCreatePassword(event.target.value)}
                placeholder="Set a temporary password"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Permissions</p>
              <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm">
                {(["canIssueTickets", "canReserveTickets", "canRetrieveTickets", "canCancelTickets"] as const).map(
                  (permission) => (
                    <label key={permission} className="flex items-center justify-between text-slate-600">
                      <span>
                        {permission === "canIssueTickets" && "Issue tickets"}
                        {permission === "canReserveTickets" && "Reserve tickets"}
                        {permission === "canRetrieveTickets" && "Retrieve tickets"}
                        {permission === "canCancelTickets" && "Cancel tickets"}
                      </span>
                      <Switch
                        checked={createPermissions[permission]}
                        onCheckedChange={(checked) =>
                          setCreatePermissions((previous) => ({ ...previous, [permission]: checked }))
                        }
                        aria-label={`Allow sub-admin to ${permission.replace("can", "").toLowerCase()}`}
                      />
                    </label>
                  ),
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              {createMessage ? (
                <p
                  className={`text-sm ${createStatus === "success" ? "text-emerald-600" : "text-rose-600"}`}
                  role={createStatus === "error" ? "alert" : "status"}
                >
                  {createMessage}
                </p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={creating} className="w-full md:w-auto">
                {creating ? "Creating account…" : "Create sub-admin"}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-slate-200">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4">Sub Admin</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Deactivate</th>
                <th className="pb-3 pr-4">Issue Tickets</th>
                <th className="pb-3 pr-4">Reserve Tickets</th>
                <th className="pb-3 pr-4">Retrieve Tickets</th>
                <th className="pb-3 pr-4">Cancel Tickets</th>
                {isMainAdmin ? <th className="pb-3 pr-4">Reset Password</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-500" colSpan={isMainAdmin ? 8 : 7}>
                    Loading sub-admins…
                  </td>
                </tr>
              ) : null}

              {!loading && subAdmins.length === 0 ? (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-500" colSpan={isMainAdmin ? 8 : 7}>
                    No sub-admins found. Try refreshing the list.
                  </td>
                </tr>
              ) : null}

              {subAdmins.map((admin) => {
                const isBusy = updating[admin.id] || loading;
                return (
                  <tr key={admin.id} className="align-middle">
                    <td className="py-3 pr-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email}</p>
                        <p className="text-xs font-medium text-slate-500">ID: {admin.id}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={admin.isActive ? "default" : "outline"}>
                        {admin.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Switch
                        checked={!admin.isActive}
                        disabled={isBusy}
                        onCheckedChange={(checked) => updateStatus(admin.id, !checked)}
                        aria-label={`Deactivate ${admin.name}`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Switch
                        checked={admin.canIssueTickets}
                        disabled={isBusy}
                        onCheckedChange={(checked) => updatePermissions(admin.id, { canIssueTickets: checked })}
                        aria-label={`Allow ${admin.name} to issue tickets`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Switch
                        checked={admin.canReserveTickets}
                        disabled={isBusy}
                        onCheckedChange={(checked) => updatePermissions(admin.id, { canReserveTickets: checked })}
                        aria-label={`Allow ${admin.name} to reserve tickets`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Switch
                        checked={admin.canRetrieveTickets}
                        disabled={isBusy}
                        onCheckedChange={(checked) => updatePermissions(admin.id, { canRetrieveTickets: checked })}
                        aria-label={`Allow ${admin.name} to retrieve tickets`}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Switch
                        checked={admin.canCancelTickets}
                        disabled={isBusy}
                        onCheckedChange={(checked) => updatePermissions(admin.id, { canCancelTickets: checked })}
                        aria-label={`Allow ${admin.name} to cancel tickets`}
                      />
                    </td>
                    {isMainAdmin ? (
                      <td className="py-3 pr-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => resetPassword(admin.id)}
                        >
                          Reset
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Search reserved tickets</p>
            <p className="text-sm text-slate-500">Enter a sub-admin ID to review the tickets they have reserved.</p>
          </div>
          <div className="flex gap-3">
            <Input
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="e.g. SA-1023"
              className="w-full md:w-64"
            />
            <Button type="button" onClick={() => setSearchId((value) => value.trim())}>
              Search
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
          {searchId === "" && <p className="text-slate-500">Enter a sub-admin ID to see their reserved tickets.</p>}
          {searchId !== "" && !searchResult && <p>No sub-admin found with ID &quot;{searchId}&quot;.</p>}
          {searchResult && (
            <div className="space-y-2">
              <p className="font-semibold text-slate-900">Reserved tickets for {searchResult.name}</p>
              {searchResult.reservedTickets.length === 0 ? (
                <p className="text-slate-500">No reserved tickets found.</p>
              ) : (
                <ul className="list-disc space-y-1 pl-5">
                  {searchResult.reservedTickets.map((ticket) => (
                    <li key={ticket} className="font-mono text-sm text-slate-800">
                      {ticket}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
