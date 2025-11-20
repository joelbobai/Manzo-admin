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
  reservedTickets: string[];
};

type PermissionKey = "canIssueTickets" | "canReserveTickets" | "canRetrieveTickets";

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
    reservedTickets: Array.isArray(payload.reservedTickets)
      ? payload.reservedTickets.map(String)
      : [],
  };
}

export default function SubAdminsPage() {
  const { authFetch, hydrated } = useAuth();
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

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
      applyRemoteSubAdmin(payload, adminId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update permissions.";
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-500" colSpan={6}>
                    Loading sub-admins…
                  </td>
                </tr>
              ) : null}

              {!loading && subAdmins.length === 0 ? (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-500" colSpan={6}>
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
                      <Badge variant={admin.isActive ? "default" : "secondary"}>
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
