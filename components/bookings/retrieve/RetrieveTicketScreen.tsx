"use client";

import RetrieveResult from "@/components/bookings/retrieve/RetrieveResult";
import IssueTicketDialog from "@/components/bookings/retrieve/IssueTicketDialog";
import RetrieveTicketDialog from "@/components/bookings/retrieve/RetrieveTicketDialog";
import { Badge } from "@/components/ui/badge";
import { ToastProvider } from "@/components/ui/use-toast";
import { useRetrieveStore } from "@/stores/useRetrieveStore";

export default function RetrieveTicketScreen() {
  return (
    <ToastProvider>
      <RetrieveTicketScreenContent />
    </ToastProvider>
  );
}

function RetrieveTicketScreenContent() {
  const result = useRetrieveStore((state) => state.result);
  const loading = useRetrieveStore((state) => state.loading);
  const orderIdOrPnr = useRetrieveStore((state) => state.orderIdOrPnr);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Retrieve Ticket</h1>
        <p className="text-sm text-slate-500">
          Load a customer booking to review fares, traveler details, and ticketing deadlines.
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Booking tools</h2>
            <p className="text-sm text-slate-500">
              Retrieve existing flight orders or simulate the issuing flow. All actions are instant and stay within this workspace.
            </p>
            {orderIdOrPnr ? (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-600">
                Last reference: {orderIdOrPnr}
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <RetrieveTicketDialog />
            <IssueTicketDialog />
          </div>
        </div>
      </section>

      {result ? <RetrieveResult order={result} /> : <EmptyState loading={loading} />}
    </div>
  );
}

type EmptyStateProps = {
  loading: boolean;
};

function EmptyState({ loading }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        🎫
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">No ticket selected yet</h2>
        <p className="text-sm text-slate-500">
          Use <strong>Retrieve Ticket</strong> to search by Flight Order ID or booking reference. We’ll show the complete itinerary once it loads.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Fetching flight order…</p>
      ) : (
        <p className="text-sm text-slate-400">Nothing will be saved until you retrieve a ticket.</p>
      )}
    </section>
  );
}
