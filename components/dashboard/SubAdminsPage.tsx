"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export type SubAdmin = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  canIssueTickets: boolean;
  canReserveTickets: boolean;
  canRetrieveTickets: boolean;
  reservedTickets: string[];
};

type PermissionKey = "status" | "canIssueTickets" | "canReserveTickets" | "canRetrieveTickets";

const DEFAULT_SUB_ADMINS: SubAdmin[] = [
  {
    id: "SA-1023",
    name: "Amina Bello",
    email: "amina.bello@manzoair.com",
    status: "active",
    canIssueTickets: true,
    canReserveTickets: true,
    canRetrieveTickets: true,
    reservedTickets: ["TCK-2201", "TCK-2244", "TCK-2250"],
  },
  {
    id: "SA-1148",
    name: "Bode Martins",
    email: "bode.martins@manzoair.com",
    status: "active",
    canIssueTickets: false,
    canReserveTickets: true,
    canRetrieveTickets: true,
    reservedTickets: ["TCK-2178"],
  },
  {
    id: "SA-1310",
    name: "Chidera Okafor",
    email: "chidera.okafor@manzoair.com",
    status: "inactive",
    canIssueTickets: false,
    canReserveTickets: false,
    canRetrieveTickets: false,
    reservedTickets: [],
  },
];

export default function SubAdminsPage() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(DEFAULT_SUB_ADMINS);
  const [searchId, setSearchId] = useState("");

  const searchResult = useMemo(() => {
    if (!searchId) return null;
    const match = subAdmins.find((admin) => admin.id.toLowerCase() === searchId.toLowerCase());
    return match ?? null;
  }, [searchId, subAdmins]);

  const updatePermission = (id: string, key: PermissionKey, value: SubAdmin[PermissionKey]) => {
    setSubAdmins((previous) =>
      previous.map((admin) =>
        admin.id === id
          ? {
              ...admin,
              [key]: value,
            }
          : admin,
      ),
    );
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
              {subAdmins.map((admin) => (
                <tr key={admin.id} className="align-middle">
                  <td className="py-3 pr-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900">{admin.name}</p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                      <p className="text-xs font-medium text-slate-500">ID: {admin.id}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                      {admin.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Switch
                      checked={admin.status === "inactive"}
                      onCheckedChange={(checked) => updatePermission(admin.id, "status", checked ? "inactive" : "active")}
                      aria-label={`Deactivate ${admin.name}`}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <Switch
                      checked={admin.canIssueTickets}
                      onCheckedChange={(checked) => updatePermission(admin.id, "canIssueTickets", checked)}
                      aria-label={`Allow ${admin.name} to issue tickets`}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <Switch
                      checked={admin.canReserveTickets}
                      onCheckedChange={(checked) => updatePermission(admin.id, "canReserveTickets", checked)}
                      aria-label={`Allow ${admin.name} to reserve tickets`}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <Switch
                      checked={admin.canRetrieveTickets}
                      onCheckedChange={(checked) => updatePermission(admin.id, "canRetrieveTickets", checked)}
                      aria-label={`Allow ${admin.name} to retrieve tickets`}
                    />
                  </td>
                </tr>
              ))}
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
          {searchId !== "" && !searchResult && <p>No sub-admin found with ID "{searchId}".</p>}
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
