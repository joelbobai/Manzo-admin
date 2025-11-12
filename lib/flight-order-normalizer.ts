import type { SampleFlightOrderResponse } from "@/lib/sample-flight-order";

export type FlightOrderResponse = SampleFlightOrderResponse;

export type LocationDictionaryEntry = {
  cityCode?: string;
  countryCode?: string;
};

export type NormalizedFlightOrder = {
  raw: FlightOrderResponse;
  summary: {
    pnr: string;
    orderId: string;
    validatingAirline: string;
    queuingOfficeId?: string;
    lastTicketingDate: {
      iso?: string;
      formatted?: string;
      short?: string;
    };
    totals: {
      currency: string;
      base: number;
      total: number;
      grandTotal: number;
      formattedBase: string;
      formattedTotal: string;
      formattedGrandTotal: string;
    };
  };
  segments: NormalizedSegment[];
  travelers: NormalizedTraveler[];
  remarks: {
    warning?: string;
    airline: string[];
    general: string[];
  };
  agencyContact?: NormalizedAgencyContact;
  locations: Record<string, LocationDictionaryEntry>;
};

export type NormalizedSegment = {
  id: string;
  carrierCode: string;
  flightNumber: string;
  carrierFlight: string;
  aircraftCode?: string;
  departure: NormalizedSegmentPoint;
  arrival: NormalizedSegmentPoint;
  cabinClassLabel?: string;
  fareBasis?: string;
  bookingStatus?: string;
  segmentType?: string;
  isFlown: boolean;
};

export type NormalizedSegmentPoint = {
  iataCode: string;
  cityCode?: string;
  terminal?: string;
  iso?: string;
  formatted?: string;
};

export type NormalizedTraveler = {
  id: string;
  name: string;
  type: string;
  priceFormatted: string;
  currency: string;
  bagLabel?: string;
  meals: string[];
  email?: string;
  phone?: string;
};

export type NormalizedAgencyContact = {
  name?: string;
  addressLines: string[];
  city?: string;
  postalCode?: string;
  countryCode?: string;
  email?: string;
};

const LAGOS_TIME_ZONE = "Africa/Lagos";
const DEFAULT_LOCALE = "en-NG";

export function normalizeFlightOrder(
  response: FlightOrderResponse,
): NormalizedFlightOrder {
  const { data, dictionaries } = response;
  const flightOffer = data.flightOffers?.[0];
  const price = flightOffer?.price ?? { currency: "NGN", total: "0" };

  const currency = price.currency ?? "NGN";
  const formatCurrency = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  });

  const base = parseAmount(price.base ?? price.total ?? price.grandTotal ?? "0");
  const total = parseAmount(price.total ?? price.grandTotal ?? price.base ?? "0");
  const grandTotal = parseAmount(
    price.grandTotal ?? price.total ?? price.base ?? "0",
  );

  const lastTicketingDate = flightOffer?.lastTicketingDate;
  const lastTicketingDateFormatted = lastTicketingDate
    ? formatDate(`${lastTicketingDate}T00:00:00`)
    : undefined;
  const lastTicketingDateShort = lastTicketingDate
    ? formatDate(`${lastTicketingDate}T00:00:00`, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : undefined;

  const fareDetailsBySegment = new Map<string, {
    class?: string;
    cabin?: string;
    fareBasis?: string;
    includedCheckedBags?: { quantity?: number };
    mealServices?: Array<{ label?: string }>;
  }>();

  flightOffer?.travelerPricings?.forEach((pricing) => {
    pricing.fareDetailsBySegment?.forEach((detail) => {
      if (!fareDetailsBySegment.has(detail.segmentId)) {
        fareDetailsBySegment.set(detail.segmentId, detail);
      }
    });
  });

  const segments: NormalizedSegment[] = [];

  flightOffer?.itineraries?.forEach((itinerary) => {
    itinerary.segments?.forEach((segment) => {
      if (!segment) {
        return;
      }

      const departure = segment.departure ?? {};
      const arrival = segment.arrival ?? {};

      const fareDetail = segment.id
        ? fareDetailsBySegment.get(segment.id)
        : undefined;

      const cabinClassLabel = buildCabinLabel(fareDetail);

      segments.push({
        id: segment.id ?? `${segments.length + 1}`,
        carrierCode: segment.carrierCode ?? "",
        flightNumber: segment.number ?? "",
        carrierFlight: buildCarrierFlight(segment.carrierCode, segment.number),
        aircraftCode: segment.aircraft?.code,
        bookingStatus: segment.bookingStatus,
        segmentType: segment.segmentType,
        isFlown: Boolean(segment.isFlown),
        fareBasis: fareDetail?.fareBasis,
        cabinClassLabel,
        departure: {
          iataCode: departure.iataCode ?? "",
          terminal: departure.terminal ?? undefined,
          iso: departure.at,
          formatted: departure.at ? formatDateTime(departure.at) : undefined,
          cityCode: dictionaries?.locations?.[departure.iataCode ?? ""]?.cityCode,
        },
        arrival: {
          iataCode: arrival.iataCode ?? "",
          terminal: arrival.terminal ?? undefined,
          iso: arrival.at,
          formatted: arrival.at ? formatDateTime(arrival.at) : undefined,
          cityCode: dictionaries?.locations?.[arrival.iataCode ?? ""]?.cityCode,
        },
      });
    });
  });

  const travelers: NormalizedTraveler[] = (data.travelers ?? []).map(
    (traveler) => {
      const travelerPricing = flightOffer?.travelerPricings?.find(
        (pricing) => pricing.travelerId === traveler.id,
      );

      const travelerCurrency =
        travelerPricing?.price?.currency ?? price.currency ?? "NGN";
      const travelerFormatCurrency = new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: "currency",
        currency: travelerCurrency,
        currencyDisplay: "symbol",
        maximumFractionDigits: 2,
      });

      const travelerMeals = new Set<string>();
      let bagLabel: string | undefined;

      travelerPricing?.fareDetailsBySegment?.forEach((detail) => {
        detail.mealServices?.forEach((meal) => {
          if (meal?.label) {
            travelerMeals.add(meal.label);
          }
        });

        const quantity = detail.includedCheckedBags?.quantity;
        if (typeof quantity === "number") {
          bagLabel = `${quantity} checked ${quantity === 1 ? "bag" : "bags"}`;
        }
      });

      const phone = traveler.contact?.phones?.[0];
      const phoneLabel = phone?.number
        ? `+${phone.countryCallingCode ?? ""} ${phone.number}`.trim()
        : undefined;

      const totalPrice = parseAmount(
        travelerPricing?.price?.total ?? travelerPricing?.price?.base ?? "0",
      );

      return {
        id: traveler.id ?? "",
        name: formatName(traveler.name?.firstName, traveler.name?.lastName),
        type: travelerPricing?.travelerType ?? "TRAVELER",
        priceFormatted: travelerFormatCurrency.format(totalPrice),
        currency: travelerCurrency,
        bagLabel,
        meals: Array.from(travelerMeals),
        email: traveler.contact?.emailAddress ?? undefined,
        phone: phoneLabel,
      };
    },
  );

  const airlineRemarks = data.remarks?.airline?.map((remark) => remark.text) ?? [];
  const generalRemarks =
    data.remarks?.general?.map((remark) => remark.text) ?? [];

  const warningRemark = airlineRemarks.find((remark) =>
    remark?.toUpperCase().includes("ADV TKT NBR"),
  );

  const agencyContact = data.contacts?.find(
    (contact) => contact.purpose === "STANDARD",
  );

  const normalizedAgencyContact: NormalizedAgencyContact | undefined =
    agencyContact
      ? {
          name:
            agencyContact.addresseeName?.firstName ??
            agencyContact.addresseeName?.lastName,
          addressLines: agencyContact.address?.lines ?? [],
          city: agencyContact.address?.cityName ?? undefined,
          postalCode: agencyContact.address?.postalCode ?? undefined,
          countryCode: agencyContact.address?.countryCode ?? undefined,
          email: agencyContact.emailAddress ?? undefined,
        }
      : undefined;

  return {
    raw: response,
    summary: {
      pnr: data.associatedRecords?.[0]?.reference ?? "",
      orderId: decodeURIComponent(data.id ?? ""),
      validatingAirline: flightOffer?.validatingAirlineCodes?.[0] ?? "",
      queuingOfficeId: data.queuingOfficeId ?? undefined,
      lastTicketingDate: {
        iso: lastTicketingDate,
        formatted: lastTicketingDateFormatted,
        short: lastTicketingDateShort,
      },
      totals: {
        currency,
        base,
        total,
        grandTotal,
        formattedBase: formatCurrency.format(base),
        formattedTotal: formatCurrency.format(total),
        formattedGrandTotal: formatCurrency.format(grandTotal),
      },
    },
    segments,
    travelers,
    remarks: {
      warning: warningRemark,
      airline: airlineRemarks.filter(Boolean),
      general: generalRemarks.filter(Boolean),
    },
    agencyContact: normalizedAgencyContact,
    locations: dictionaries?.locations ?? {},
  };
}

function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildCabinLabel(detail?: {
  class?: string;
  cabin?: string;
}): string | undefined {
  if (!detail) {
    return undefined;
  }

  if (detail.cabin && detail.class) {
    return `${detail.cabin} (${detail.class})`;
  }

  if (detail.cabin) {
    return detail.cabin;
  }

  if (detail.class) {
    return `Class ${detail.class}`;
  }

  return undefined;
}

function buildCarrierFlight(
  carrierCode?: string,
  flightNumber?: string,
): string {
  return [carrierCode, flightNumber].filter(Boolean).join(" ");
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: LAGOS_TIME_ZONE,
  }).format(normalizeDateInput(value));
}

function formatDate(
  value: string,
  overrides?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(
    DEFAULT_LOCALE,
    overrides ?? {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: LAGOS_TIME_ZONE,
    },
  ).format(normalizeDateInput(value));
}

function normalizeDateInput(raw: string): Date {
  if (!raw) {
    return new Date();
  }

  if (raw.endsWith("Z") || raw.includes("+")) {
    return new Date(raw);
  }

  if (raw.includes("T")) {
    return new Date(`${raw}Z`);
  }

  return new Date(`${raw}T00:00:00Z`);
}

function formatName(
  firstName?: string,
  lastName?: string,
): string {
  return [firstName, lastName]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .trim();
}
