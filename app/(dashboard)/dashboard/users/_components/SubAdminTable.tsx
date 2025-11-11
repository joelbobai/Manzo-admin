"use client";

import { useEffect, useState } from "react";

import { BadgeCheckIcon, BanIcon, EyeIcon, MoreVerticalIcon, TicketIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import type { SubAdmin } from "@/stores/useUsersStore";

type SubAdminTableProps = {
  subAdmins: SubAdmin[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleActive: (id: string) => void;
  onDisable: (id: string) => void;
  onTogglePermission: (
    id: string,
    key: "canReserveTickets" | "canIssueTickets",
  ) => void;
  pendingActiveIds: Set<string>;
  onResetSearch: () => void;
};

export default function SubAdminTable({
  subAdmins,
  isLoading,
  searchTerm,
  onSearchChange,
  onToggleActive,
  onDisable,
  onTogglePermission,
  pendingActiveIds,
  onResetSearch,
}: SubAdminTableProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-menu-root]")) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          disabled
        />
        <div className="space-y-3 rounded-3xl bg-white p-6 shadow-sm">
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (subAdmins.length === 0) {
    return (
      <div className="space-y-4">
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onResetSearch={onResetSearch}
          showReset={Boolean(searchTerm)}
        />
        <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500">
            <TicketIcon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">No sub-admins found</h3>
            <p className="text-sm text-slate-500">
              {searchTerm
                ? "No results match your search. Clear the filter or add someone new."
                : "Invite your first teammate to collaborate on bookings and ticketing."}
            </p>
          </div>
          {searchTerm ? (
            <Button onClick={onResetSearch} variant="outline">
              Clear search
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onResetSearch={onResetSearch}
        showReset={Boolean(searchTerm)}
      />
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="hidden min-w-full divide-y divide-slate-100 md:block">
          <table className="min-w-full table-fixed">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {subAdmins.map((subAdmin) => {
                const isSaving = pendingActiveIds.has(subAdmin.id);
                const menuOpen = menuOpenId === subAdmin.id;
                return (
                  <tr key={subAdmin.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={subAdmin.avatarUrl}
                          alt={subAdmin.name}
                          name={subAdmin.name}
                        />
                        <div>
                          <p className="font-medium text-slate-900">{subAdmin.name}</p>
                          <p className="text-xs text-slate-500">
                            Joined {new Date(subAdmin.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">{subAdmin.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={subAdmin.isActive}
                          onCheckedChange={() => onToggleActive(subAdmin.id)}
                          aria-label={`Toggle active for ${subAdmin.name}`}
                          disabled={isSaving}
                        />
                        <Badge variant={subAdmin.isActive ? "success" : "outline"}>
                          {subAdmin.isActive ? "Active" : "Disabled"}
                        </Badge>
                        {isSaving ? (
                          <span
                            className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"
                            aria-label="Saving"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-4">
                        <PermissionToggle
                          label="Reserve Tickets"
                          isChecked={subAdmin.canReserveTickets}
                          onChange={() => onTogglePermission(subAdmin.id, "canReserveTickets")}
                        />
                        <PermissionToggle
                          label="Issue Tickets"
                          isChecked={subAdmin.canIssueTickets}
                          onChange={() => onTogglePermission(subAdmin.id, "canIssueTickets")}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className="relative flex items-center justify-end gap-2"
                        data-menu-root
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3"
                          aria-label={`View profile for ${subAdmin.name}`}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={subAdmin.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() =>
                            subAdmin.isActive
                              ? setConfirmingId(subAdmin.id)
                              : onDisable(subAdmin.id)
                          }
                          disabled={isSaving}
                        >
                          {subAdmin.isActive ? "Disable" : "Enable"}
                        </Button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                          aria-haspopup="menu"
                          aria-expanded={menuOpen}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMenuOpenId(menuOpen ? null : subAdmin.id);
                          }}
                        >
                          <MoreVerticalIcon className="h-4 w-4" />
                        </button>
                        {menuOpen ? (
                          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 text-sm shadow-xl">
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-slate-600 transition hover:bg-slate-100"
                              onClick={() => {
                                setMenuOpenId(null);
                                onTogglePermission(subAdmin.id, "canReserveTickets");
                              }}
                            >
                              <BadgeCheckIcon className="h-4 w-4" /> Promote to lead
                            </button>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-slate-600 transition hover:bg-slate-100"
                              onClick={() => {
                                setMenuOpenId(null);
                                onTogglePermission(subAdmin.id, "canIssueTickets");
                              }}
                            >
                              <TicketIcon className="h-4 w-4" /> Toggle issuing
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {subAdmins.map((subAdmin) => {
            const isSaving = pendingActiveIds.has(subAdmin.id);
            return (
              <div key={subAdmin.id} className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={subAdmin.avatarUrl}
                    alt={subAdmin.name}
                    name={subAdmin.name}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{subAdmin.name}</p>
                    <p className="text-xs text-slate-500">{subAdmin.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                    <Badge variant={subAdmin.isActive ? "success" : "outline"}>
                      {subAdmin.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <Switch
                    checked={subAdmin.isActive}
                    onCheckedChange={() => onToggleActive(subAdmin.id)}
                    aria-label={`Toggle active for ${subAdmin.name}`}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase text-slate-400">Permissions</p>
                  <PermissionToggle
                    label="Reserve Tickets"
                    isChecked={subAdmin.canReserveTickets}
                    onChange={() => onTogglePermission(subAdmin.id, "canReserveTickets")}
                  />
                  <PermissionToggle
                    label="Issue Tickets"
                    isChecked={subAdmin.canIssueTickets}
                    onChange={() => onTogglePermission(subAdmin.id, "canIssueTickets")}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={subAdmin.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() =>
                      subAdmin.isActive
                        ? setConfirmingId(subAdmin.id)
                        : onDisable(subAdmin.id)
                    }
                    className="flex-1"
                    disabled={isSaving}
                  >
                    {subAdmin.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="ghost" size="icon" className="border border-slate-200">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {confirmingId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <BanIcon className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                Disable this account?
              </h2>
              <p className="text-sm text-slate-500">
                They won’t be able to sign in until you re-enable them.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" onClick={() => setConfirmingId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const id = confirmingId;
                  setConfirmingId(null);
                  onDisable(id);
                }}
              >
                Disable
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ToolbarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  disabled?: boolean;
  onResetSearch?: () => void;
  showReset?: boolean;
};

function Toolbar({
  searchTerm,
  onSearchChange,
  disabled,
  onResetSearch,
  showReset,
}: ToolbarProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or email"
          disabled={disabled}
          aria-label="Search sub-admins"
          className="w-full min-w-[18rem] sm:w-72"
        />
        {showReset && onResetSearch ? (
          <Button variant="ghost" onClick={onResetSearch} disabled={disabled}>
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type PermissionToggleProps = {
  label: string;
  isChecked: boolean;
  onChange: () => void;
};

function PermissionToggle({ label, isChecked, onChange }: PermissionToggleProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2">
      <Switch
        checked={isChecked}
        onCheckedChange={onChange}
        aria-label={`${label} permission`}
      />
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">
          {isChecked ? "Enabled" : "Disabled"}
        </p>
      </div>
    </div>
  );
}
