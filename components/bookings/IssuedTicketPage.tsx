"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type IssueTicketResponse = {
  data: FlightOrder;
  dictionaries?: {
    locations?: Record<string, LocationDictionary>;
  };
};

export type FlightOrder = {
  type: string;
  id: string;
  queuingOfficeId?: string;
  associatedRecords?: AssociatedRecord[];
  flightOffers?: FlightOffer[];
  travelers?: Traveler[];
  remarks?: Remarks;
  ticketingAgreement?: {
    option?: string;
  };
  contacts?: Contact[];
  tickets?: Ticket[];
  commissions?: Commission[];
};

export type AssociatedRecord = {
  reference?: string;
  originSystemCode?: string;
  flightOfferId?: string;
  creationDate?: string;
};

export type FlightOffer = {
  type?: string;
  id?: string;
  source?: string;
  nonHomogeneous?: boolean;
  lastTicketingDate?: string;
  itineraries?: Itinerary[];
  price?: Price;
  pricingOptions?: PricingOptions;
  validatingAirlineCodes?: string[];
  travelerPricings?: TravelerPricing[];
};

export type Itinerary = {
  segments?: Segment[];
};

export type Segment = {
  departure?: LocationInfo;
  arrival?: LocationInfo;
  carrierCode?: string;
  number?: string;
  aircraft?: {
    code?: string;
  };
  bookingStatus?: string;
  segmentType?: string;
  isFlown?: boolean;
  id?: string;
  numberOfStops?: number;
};

export type LocationInfo = {
  iataCode?: string;
  terminal?: string;
  at?: string;
};

export type Price = {
  currency?: string;
  total?: string;
  base?: string;
  grandTotal?: string;
};

export type PricingOptions = {
  fareType?: string[];
};

export type TravelerPricing = {
  travelerId?: string;
  travelerType?: string;
  price?: TravelerPrice;
  fareDetailsBySegment?: FareDetailsBySegment[];
};

export type TravelerPrice = {
  currency?: string;
  total?: string;
  base?: string;
  taxes?: Tax[];
};

export type Tax = {
  amount?: string;
  code?: string;
};

export type FareDetailsBySegment = {
  segmentId?: string;
  fareBasis?: string;
  class?: string;
  includedCheckedBags?: {
    weight?: number;
    weightUnit?: string;
  };
};

export type Traveler = {
  id: string;
  gender?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  contact?: ContactInfo;
};

export type ContactInfo = {
  purpose?: string;
  phones?: Phone[];
  emailAddress?: string;
};

export type Phone = {
  deviceType?: string;
  countryCallingCode?: string;
  number?: string;
};

export type Remarks = {
  general?: {
    subType?: string;
    text?: string;
    flightOfferIds?: string[];
  }[];
};

export type Contact = {
  addresseeName?: {
    firstName?: string;
    lastName?: string;
  };
  address?: Address;
  purpose?: string;
  emailAddress?: string;
};

export type Address = {
  lines?: string[];
  postalCode?: string;
  countryCode?: string;
  cityName?: string;
};

export type Ticket = {
  documentType?: string;
  documentNumber?: string;
  documentStatus?: string;
  travelerId?: string;
  segmentIds?: string[];
};

export type Commission = {
  controls?: string[];
  values?: {
    commissionType?: string;
    amount?: string;
  }[];
};

export type LocationDictionary = {
  cityCode?: string;
  countryCode?: string;
};

export default function IssuedTicketPage() {
  const [response, setResponse] = useState<IssueTicketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const { ticket, error: message } = readIssuedTicket();
    setResponse(ticket);
    setError(message);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const ticketLookup = useMemo(() => {
    return new Map(response?.data.tickets?.map((ticket) => [ticket.travelerId ?? "", ticket]));
  }, [response]);

  if (error || !response) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Bookings</p>
            <h1 className="text-2xl font-semibold text-slate-900">Issued ticket details</h1>
            <p className="text-sm text-slate-500">Review an issued ticket after running the Issue by ID action.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/bookings">Back to bookings</Link>
          </Button>
        </header>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          {error ?? "No issued ticket details are available yet."}
        </div>
      </div>
    );
  }

  const { data, dictionaries } = response;
  const flightOffer = data.flightOffers?.[0];
  const recordLocator = data.associatedRecords?.[0]?.reference ?? "—";
  const validatingAirlines = flightOffer?.validatingAirlineCodes ?? [];
  const locations = dictionaries?.locations ?? {};

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Bookings</p>
          <h1 className="text-2xl font-semibold text-slate-900">Issued ticket details</h1>
          <p className="text-sm text-slate-500">
            Ticket {recordLocator} — reviewing the complete response from the Issue by ID action.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/bookings">Back to bookings</Link>
          </Button>
          <Button
            onClick={() => {
              window.sessionStorage.removeItem("lastIssuedTicket");
              const { ticket, error: message } = readIssuedTicket();
              setResponse(ticket);
              setError(message);
            }}
          >
            Clear response
          </Button>
        </div>
      </header>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Flight order</p>
            <h2 className="text-xl font-semibold text-slate-900">{data.id}</h2>
            <p className="text-sm text-slate-500">Record locator {recordLocator}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {validatingAirlines.length > 0 ? (
              validatingAirlines.map((airline) => (
                <Badge key={airline} variant="outline">
                  Validating: {airline}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">Validating airline not provided</Badge>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DescriptionItem label="Queuing office" value={data.queuingOfficeId} />
          <DescriptionItem label="Ticketing option" value={data.ticketingAgreement?.option} />
          <DescriptionItem label="Last ticketing date" value={formatDate(flightOffer?.lastTicketingDate)} />
          <DescriptionItem label="Flight offer" value={flightOffer?.id} />
          <DescriptionItem
            label="Pricing model"
            value={flightOffer?.pricingOptions?.fareType?.join(", ")}
            placeholder="Not provided"
          />
          <DescriptionItem
            label="Commissions"
            value={formatCommission(data.commissions)}
            placeholder="None"
          />
        </dl>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Payment summary</p>
            <h2 className="text-xl font-semibold text-slate-900">Total {flightOffer?.price?.currency ?? "—"}</h2>
          </div>
          <Badge variant="outline">Grand total: {flightOffer?.price?.grandTotal ?? flightOffer?.price?.total ?? "—"}</Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Base fare" value={flightOffer?.price?.base} currency={flightOffer?.price?.currency} />
          <StatCard label="Total" value={flightOffer?.price?.total} currency={flightOffer?.price?.currency} />
          <StatCard label="Grand total" value={flightOffer?.price?.grandTotal} currency={flightOffer?.price?.currency} />
          <StatCard
            label="Travelers"
            value={`${flightOffer?.travelerPricings?.length ?? 0} passengers`}
            currency=""
          />
        </div>

        {flightOffer?.travelerPricings ? (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Traveler pricing</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {flightOffer.travelerPricings.map((pricing) => (
                <div key={`${pricing.travelerId}-${pricing.travelerType}`} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Traveler {pricing.travelerId}</p>
                      <p className="text-xs text-slate-500">{pricing.travelerType ?? "Unknown type"}</p>
                    </div>
                    <Badge variant="outline">{pricing.price?.currency ?? ""} {pricing.price?.total ?? "—"}</Badge>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>Base: {pricing.price?.base ?? "—"}</li>
                    <li>Taxes: {formatTaxes(pricing.price?.taxes)}</li>
                    {pricing.fareDetailsBySegment?.map((segment) => (
                      <li key={`${segment.segmentId}-${segment.fareBasis}`} className="text-xs text-slate-500">
                        Segment {segment.segmentId}: class {segment.class ?? "—"}, fare {segment.fareBasis ?? "—"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Itinerary</p>
            <h2 className="text-xl font-semibold text-slate-900">Flight segments</h2>
          </div>
          <Badge variant="secondary">{flightOffer?.itineraries?.length ?? 0} routes</Badge>
        </div>

        <div className="mt-4 space-y-4">
          {flightOffer?.itineraries?.map((itinerary, itineraryIndex) => (
            <div key={itineraryIndex} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-sm font-semibold text-slate-700">Itinerary {itineraryIndex + 1}</p>
              <div className="mt-3 space-y-3">
                {itinerary.segments?.map((segment) => (
                  <div
                    key={segment.id ?? `${segment.departure?.iataCode}-${segment.arrival?.iataCode}-${segment.number}`}
                    className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">
                          {segment.departure?.iataCode ?? "—"} → {segment.arrival?.iataCode ?? "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatLocation(segment.departure?.iataCode, locations)} to {" "}
                          {formatLocation(segment.arrival?.iataCode, locations)}
                        </p>
                      </div>
                      <Badge variant="outline">{segment.carrierCode ?? "—"} {segment.number ?? "—"}</Badge>
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <DescriptionItem label="Departure" value={formatDateTime(segment.departure?.at)} />
                      <DescriptionItem label="Arrival" value={formatDateTime(segment.arrival?.at)} />
                      <DescriptionItem label="Aircraft" value={segment.aircraft?.code} />
                      <DescriptionItem label="Booking status" value={segment.bookingStatus} />
                      <DescriptionItem label="Segment type" value={segment.segmentType} />
                      <DescriptionItem
                        label="Stops"
                        value={typeof segment.numberOfStops === "number" ? segment.numberOfStops.toString() : undefined}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Travelers</p>
            <h2 className="text-xl font-semibold text-slate-900">Passengers & contacts</h2>
          </div>
          <Badge variant="outline">{data.travelers?.length ?? 0} people</Badge>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.travelers?.map((traveler) => {
            const ticket = ticketLookup.get(traveler.id);
            return (
              <div key={traveler.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {traveler.name?.firstName} {traveler.name?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">Traveler ID {traveler.id}</p>
                  </div>
                  {traveler.gender ? <Badge variant="secondary">{traveler.gender}</Badge> : null}
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>Email: {traveler.contact?.emailAddress ?? "—"}</p>
                  <p>
                    Phone: {traveler.contact?.phones?.map((phone) => `+${phone.countryCallingCode ?? ""} ${phone.number ?? ""}`).join(
                      ", ",
                    ) ?? "—"}
                  </p>
                  <p>Ticket: {ticket?.documentNumber ?? "Not issued"}</p>
                </div>
              </div>
            );
          })}
        </div>

        {data.contacts && data.contacts.length > 0 ? (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Agency contacts</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {data.contacts.map((contact, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{contact.addresseeName?.firstName ?? "Contact"}</p>
                  <p className="text-xs text-slate-500">{contact.purpose ?? "STANDARD"}</p>
                  <p className="mt-2">Email: {contact.emailAddress ?? "—"}</p>
                  <p>{contact.address?.lines?.join(", ") ?? "—"}</p>
                  <p>
                    {contact.address?.cityName ?? ""} {contact.address?.postalCode ?? ""} {contact.address?.countryCode ?? ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tickets</p>
            <h2 className="text-xl font-semibold text-slate-900">Document numbers</h2>
          </div>
          <Badge variant="secondary">{data.tickets?.length ?? 0} documents</Badge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2">Document</th>
                <th className="px-4 py-2">Traveler</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Segments</th>
              </tr>
            </thead>
            <tbody>
              {data.tickets?.map((ticket) => (
                <tr key={ticket.documentNumber} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{ticket.documentNumber}</td>
                  <td className="px-4 py-3">Traveler {ticket.travelerId}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ticket.documentStatus === "ISSUED" ? "success" : "secondary"}>
                      {ticket.documentStatus ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{ticket.segmentIds?.join(", ") ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {data.remarks?.general && data.remarks.general.length > 0 ? (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Remarks</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.remarks.general.map((remark, index) => (
              <li key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{remark.subType ?? "General"}</p>
                <p className="text-slate-700">{remark.text ?? "No remark provided."}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function DescriptionItem({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value ?? placeholder ?? "—"}</p>
    </div>
  );
}

function StatCard({ label, value, currency }: { label: string; value?: string; currency?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value ? `${currency ? `${currency} ` : ""}${value}` : "—"}</p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function formatTaxes(taxes?: Tax[]) {
  if (!taxes || taxes.length === 0) return "—";
  return taxes.map((tax) => `${tax.code ?? ""} ${tax.amount ?? ""}`.trim()).join(", ");
}

function formatCommission(commissions?: Commission[]) {
  if (!commissions || commissions.length === 0) return undefined;
  const values = commissions
    .flatMap((commission) => commission.values ?? [])
    .map((value) => `${value.commissionType ?? ""} ${value.amount ?? ""}`.trim())
    .filter(Boolean);
  return values.length > 0 ? values.join(", ") : undefined;
}

function formatLocation(code: string | undefined, locations: Record<string, LocationDictionary>) {
  if (!code) return "—";
  const entry = locations[code];
  if (!entry) return code;
  const parts = [entry.cityCode, entry.countryCode].filter(Boolean);
  return parts.length > 0 ? `${code} • ${parts.join(", ")}` : code;
}

function readIssuedTicket(): { ticket: IssueTicketResponse | null; error: string | null } {
  if (typeof window === "undefined") {
    return { ticket: null, error: null };
  }

  const stored = window.sessionStorage.getItem("lastIssuedTicket");
  if (!stored) {
    return { ticket: null, error: "No issued ticket data found. Issue a ticket to review its details." };
  }

  try {
    const parsed: IssueTicketResponse = JSON.parse(stored);
    return { ticket: parsed, error: null };
  } catch (parseError) {
    console.error("Unable to parse stored ticket response", parseError);
    return { ticket: null, error: "We couldn't read the latest issued ticket details." };
  }
}
