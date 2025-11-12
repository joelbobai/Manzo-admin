"use client";

import { useCallback } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JsonCopyButton from "@/components/bookings/retrieve/JsonCopyButton";
import type {
  NormalizedAgencyContact,
  NormalizedFlightOrder,
  NormalizedSegment,
  NormalizedTraveler,
} from "@/lib/flight-order-normalizer";
import { useRetrieveStore } from "@/stores/useRetrieveStore";

import { useToast } from "@/components/ui/use-toast";

type RetrieveResultProps = {
  order: NormalizedFlightOrder;
};

export default function RetrieveResult({ order }: RetrieveResultProps) {
  const clear = useRetrieveStore((state) => state.clear);
  const router = useRouter();
  const { toast } = useToast();

  const handlePrint = useCallback(() => {
    const preview = window.open("", "_blank", "width=900,height=700");

    if (!preview) {
      toast({
        variant: "destructive",
        title: "Print preview blocked",
        description: "Allow pop-ups to print the itinerary.",
      });
      return;
    }

    preview.document.write(buildPrintTemplate(order));
    preview.document.close();
    preview.focus();
    preview.print();
  }, [order, toast]);

  const handleExportPdf = useCallback(() => {
    const preview = window.open("", "_blank", "width=900,height=700");

    if (!preview) {
      toast({
        variant: "destructive",
        title: "Export blocked",
        description: "Allow pop-ups to simulate the PDF export.",
      });
      return;
    }

    preview.document.write(buildPrintTemplate(order, {
      headline: "Flight Order (PDF preview)",
      footer: "This is a demo export. Generate the official PDF from the production system.",
    }));
    preview.document.close();
    preview.focus();
  }, [order, toast]);

  const handleBack = useCallback(() => {
    clear();
    router.push("/bookings");
  }, [clear, router]);

  const { summary, segments, travelers, remarks, agencyContact, raw, locations } =
    order;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Flight order summary
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {summary.pnr ? `PNR ${summary.pnr}` : "Retrieved ticket"}
          </h2>
          <p className="text-sm text-slate-500">
            Validating airline {summary.validatingAirline || "—"} · Last ticketing date
            {" "}
            {summary.lastTicketingDate.short ? (
              <Badge
                variant="outline"
                className="ml-2 border-amber-200 bg-amber-50 text-amber-700"
              >
                {summary.lastTicketingDate.short}
              </Badge>
            ) : (
              <span className="ml-2">—</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handlePrint}>
            Print Itinerary
          </Button>
          <Button variant="outline" onClick={handleExportPdf}>
            Export PDF
          </Button>
          <JsonCopyButton data={raw} />
          <Button variant="ghost" onClick={handleBack}>
            Back to Bookings
          </Button>
        </div>
      </header>

      <div className="space-y-8 px-6 py-6">
        <SummaryBar order={order} />
        <div className="space-y-3">
          <SectionHeading title="Segments" description="Every leg of the trip with localised times." />
          <SegmentsTable segments={segments} locations={locations} />
        </div>
        <div className="space-y-3">
          <SectionHeading title="Travelers" description="Fare breakdown per traveler." />
          <TravelersList travelers={travelers} />
        </div>
        <RemarksCallout remarks={remarks} />
        <AgencyContactCard contact={agencyContact} />
        <footer className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-500">
          Need to make changes? Use the <Link href="/bookings" className="font-medium text-slate-900 underline underline-offset-4">Bookings workspace</Link> to modify or re-issue tickets.
        </footer>
      </div>
    </section>
  );
}

type SummaryBarProps = {
  order: NormalizedFlightOrder;
};

function SummaryBar({ order }: SummaryBarProps) {
  const { summary } = order;

  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-5">
        <SummaryField label="PNR" value={summary.pnr || "—"} />
        <SummaryField
          label="Order ID"
          value={summary.orderId || "—"}
          className="truncate"
        />
        <SummaryField
          label="Validating airline"
          value={summary.validatingAirline || "—"}
        />
        <SummaryField
          label="Last ticketing date"
          value={summary.lastTicketingDate.formatted || summary.lastTicketingDate.short || "—"}
        />
        <SummaryField
          label="Grand total"
          value={summary.totals.formattedGrandTotal}
          emphasis
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <SummaryField label="Base fare" value={summary.totals.formattedBase} />
        <SummaryField
          label="Total (incl. taxes)"
          value={summary.totals.formattedTotal}
        />
      </div>
    </div>
  );
}

type SummaryFieldProps = {
  label: string;
  value: string;
  emphasis?: boolean;
  className?: string;
};

function SummaryField({ label, value, emphasis, className }: SummaryFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-sm ${emphasis ? "font-semibold text-slate-900" : "text-slate-700"}`}>
        {value}
      </p>
    </div>
  );
}

type SectionHeadingProps = {
  title: string;
  description?: string;
};

function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

type SegmentsTableProps = {
  segments: NormalizedSegment[];
  locations: NormalizedFlightOrder["locations"];
};

function SegmentsTable({ segments, locations }: SegmentsTableProps) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">
        <table className="min-w-full divide-y divide-slate-200" aria-label="Flight segments">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="sticky top-0 px-4 py-3">Route</th>
              <th className="sticky top-0 px-4 py-3">Carrier / Flight</th>
              <th className="sticky top-0 px-4 py-3">Departs</th>
              <th className="sticky top-0 px-4 py-3">Arrives</th>
              <th className="sticky top-0 px-4 py-3">Terminal</th>
              <th className="sticky top-0 px-4 py-3">Cabin / Class</th>
              <th className="sticky top-0 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {segments.map((segment) => (
              <tr key={segment.id} className="bg-white">
                <td className="px-4 py-4 align-top">
                  <RouteCell segment={segment} locations={locations} />
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">{segment.carrierFlight || "—"}</p>
                    {segment.aircraftCode ? (
                      <p className="text-xs text-slate-500">Aircraft {segment.aircraftCode}</p>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <TimeCell point={segment.departure} />
                </td>
                <td className="px-4 py-4 align-top">
                  <TimeCell point={segment.arrival} />
                </td>
                <td className="px-4 py-4 align-top">
                  <TerminalCell segment={segment} />
                </td>
                <td className="px-4 py-4 align-top">
                  {segment.cabinClassLabel ? segment.cabinClassLabel : "—"}
                  {segment.fareBasis ? (
                    <p className="text-xs text-slate-500">Fare {segment.fareBasis}</p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top">
                  <StatusCell segment={segment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {segments.map((segment) => (
          <div key={segment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <RouteCell segment={segment} locations={locations} />
              <StatusCell segment={segment} />
            </div>
            <div className="mt-3 grid gap-3 text-sm text-slate-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Carrier</p>
                <p className="font-medium text-slate-900">{segment.carrierFlight || "—"}</p>
                {segment.aircraftCode ? (
                  <p className="text-xs text-slate-500">Aircraft {segment.aircraftCode}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Departs</p>
                  <TimeCell point={segment.departure} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Arrives</p>
                  <TimeCell point={segment.arrival} />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Cabin / Class</p>
                <p>{segment.cabinClassLabel ?? "—"}</p>
                {segment.fareBasis ? (
                  <p className="text-xs text-slate-500">Fare {segment.fareBasis}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Terminal</p>
                <TerminalCell segment={segment} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type RouteCellProps = {
  segment: NormalizedSegment;
  locations: NormalizedFlightOrder["locations"];
};

function RouteCell({ segment, locations }: RouteCellProps) {
  const departureCity = locations?.[segment.departure.iataCode]?.cityCode;
  const arrivalCity = locations?.[segment.arrival.iataCode]?.cityCode;
  const tooltip = [
    departureCity ? `${segment.departure.iataCode} · ${departureCity}` : undefined,
    arrivalCity ? `${segment.arrival.iataCode} · ${arrivalCity}` : undefined,
  ]
    .filter(Boolean)
    .join(" → ");
  const cityLabel = [departureCity, arrivalCity].filter(Boolean).join(" → ");

  return (
    <div className="space-y-1" title={tooltip}>
      <p className="text-base font-semibold text-slate-900">
        {segment.departure.iataCode} → {segment.arrival.iataCode}
      </p>
      {cityLabel ? <p className="text-xs text-slate-500">{cityLabel}</p> : null}
    </div>
  );
}

type TimeCellProps = {
  point: NormalizedSegment["departure"];
};

function TimeCell({ point }: TimeCellProps) {
  if (!point?.formatted) {
    return <span>—</span>;
  }

  return (
    <p className="font-medium text-slate-900">{point.formatted}</p>
  );
}

type TerminalCellProps = {
  segment: NormalizedSegment;
};

function TerminalCell({ segment }: TerminalCellProps) {
  const terminals = [segment.departure.terminal, segment.arrival.terminal].filter(
    Boolean,
  );

  if (terminals.length === 0) {
    return <span>—</span>;
  }

  return (
    <div className="space-y-1 text-sm text-slate-700">
      {segment.departure.terminal ? (
        <p>
          {segment.departure.iataCode}: Terminal {segment.departure.terminal}
        </p>
      ) : null}
      {segment.arrival.terminal ? (
        <p>
          {segment.arrival.iataCode}: Terminal {segment.arrival.terminal}
        </p>
      ) : null}
    </div>
  );
}

type StatusCellProps = {
  segment: NormalizedSegment;
};

function StatusCell({ segment }: StatusCellProps) {
  const badges: ReactNode[] = [];

  if (segment.bookingStatus) {
    const statusVariant = segment.bookingStatus === "CONFIRMED" ? "success" : "default";
    badges.push(
      <Badge key="status" variant={statusVariant as "default" | "success"}>
        {segment.bookingStatus}
      </Badge>,
    );
  }

  if (segment.segmentType) {
    badges.push(
      <Badge key="type" variant="outline" className="border-blue-200 text-blue-600">
        {segment.segmentType}
      </Badge>,
    );
  }

  badges.push(
    <Badge key="flow" variant="outline" className="border-slate-200 text-slate-600">
      {segment.isFlown ? "Flown" : "Upcoming"}
    </Badge>,
  );

  return <div className="flex flex-wrap gap-2">{badges}</div>;
}

type TravelersListProps = {
  travelers: NormalizedTraveler[];
};

function TravelersList({ travelers }: TravelersListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {travelers.map((traveler) => (
        <div
          key={traveler.id}
          className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  {traveler.name || "Traveler"}
                </h4>
                <p className="text-sm text-slate-500">{traveler.email || "No email provided"}</p>
                {traveler.phone ? (
                  <p className="text-sm text-slate-500">{traveler.phone}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-purple-200 text-purple-600">
                  {traveler.type}
                </Badge>
                {traveler.bagLabel ? (
                  <Badge variant="outline" className="border-slate-200 text-slate-600">
                    {traveler.bagLabel}
                  </Badge>
                ) : null}
              </div>
            </div>
            {traveler.meals.length > 0 ? (
              <p className="text-sm text-slate-500">
                Meals: {traveler.meals.join(", ")}
              </p>
            ) : null}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-right text-sm font-semibold text-slate-900">
            {traveler.priceFormatted}
          </div>
        </div>
      ))}
    </div>
  );
}

type RemarksCalloutProps = {
  remarks: NormalizedFlightOrder["remarks"];
};

function RemarksCallout({ remarks }: RemarksCalloutProps) {
  if (!remarks.warning && remarks.airline.length === 0 && remarks.general.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <SectionHeading title="Remarks" description="Important notes from the airline and pricing." />
      {remarks.warning ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span aria-hidden="true">⚠️</span>
          <div>
            <p className="font-semibold">Ticketing deadline</p>
            <p>{remarks.warning}</p>
          </div>
        </div>
      ) : null}
      {remarks.airline.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Airline notes</p>
          <ul className="space-y-1">
            {remarks.airline.map((note, index) => (
              <li key={`airline-${index}`}>• {note}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {remarks.general.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Pricing remarks</p>
          <ul className="space-y-1">
            {remarks.general.map((note, index) => (
              <li key={`general-${index}`}>• {note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

type AgencyContactCardProps = {
  contact?: NormalizedAgencyContact;
};

function AgencyContactCard({ contact }: AgencyContactCardProps) {
  if (!contact) {
    return null;
  }

  return (
    <div className="space-y-3">
      <SectionHeading title="Agency contact" description="Reach out to the servicing office for any updates." />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-base font-semibold text-slate-900">{contact.name || "Agency"}</p>
        <div className="mt-2 text-sm text-slate-600">
          {contact.addressLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <p>
            {[contact.postalCode, contact.city].filter(Boolean).join(" ")}
          </p>
          <p>{contact.countryCode}</p>
          {contact.email ? (
            <p className="mt-2 font-medium text-slate-900">{contact.email}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function buildPrintTemplate(
  order: NormalizedFlightOrder,
  options?: { headline?: string; footer?: string },
): string {
  const { summary, segments, travelers } = order;

  const segmentRows = segments
    .map(
      (segment) => `
      <tr>
        <td>${segment.departure.iataCode} → ${segment.arrival.iataCode}</td>
        <td>${segment.carrierFlight}</td>
        <td>${segment.departure.formatted ?? ""}</td>
        <td>${segment.arrival.formatted ?? ""}</td>
      </tr>
    `,
    )
    .join("\n");

  const travelerRows = travelers
    .map(
      (traveler) => `
      <tr>
        <td>${traveler.name}</td>
        <td>${traveler.type}</td>
        <td>${traveler.priceFormatted}</td>
      </tr>
    `,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <title>${options?.headline ?? "Flight Order"}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: #0f172a; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      h2 { font-size: 18px; margin-top: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #cbd5f5; padding: 8px; text-align: left; font-size: 14px; }
      th { background-color: #f1f5f9; text-transform: uppercase; letter-spacing: 0.05em; font-size: 12px; }
      footer { margin-top: 32px; font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <h1>${options?.headline ?? "Flight order summary"}</h1>
    <p>PNR ${summary.pnr || "—"} · Order ID ${summary.orderId || "—"}</p>
    <p>Validating airline ${summary.validatingAirline || "—"}</p>
    <p>Grand total ${summary.totals.formattedGrandTotal}</p>

    <h2>Segments</h2>
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Carrier</th>
          <th>Departure</th>
          <th>Arrival</th>
        </tr>
      </thead>
      <tbody>
        ${segmentRows}
      </tbody>
    </table>

    <h2>Travelers</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${travelerRows}
      </tbody>
    </table>

    <footer>${
      options?.footer ??
      "This preview is for demonstration purposes. Use the admin console for official documents."
    }</footer>
  </body>
</html>`;
}
