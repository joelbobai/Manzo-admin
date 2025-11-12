export const SAMPLE_FLIGHT_ORDER_RESPONSE = {
  meta: {
    count: 1,
    links: {
      self: "https://test.travel.api.amadeus.com/v1/booking/flight-orders/eJzTd9e3tHAKtQgBAApqAjo%20",
    },
  },
  data: {
    type: "flight-order",
    id: "eJzTd9e3tHAKtQgBAApqAjo%3D",
    queuingOfficeId: "YOLN828MZ",
    associatedRecords: [
      { reference: "98BU8T", originSystemCode: "LH", flightOfferId: "1" },
      {
        reference: "98BU8T",
        creationDate: "2025-11-11T15:27:00",
        originSystemCode: "GDS",
        flightOfferId: "1",
      },
    ],
    flightOffers: [
      {
        type: "flight-offer",
        id: "1",
        source: "GDS",
        nonHomogeneous: false,
        lastTicketingDate: "2025-11-12",
        itineraries: [
          {
            segments: [
              {
                departure: {
                  iataCode: "CDG",
                  terminal: "1",
                  at: "2025-11-25T08:45:00",
                },
                arrival: {
                  iataCode: "FRA",
                  terminal: "1",
                  at: "2025-11-25T10:00:00",
                },
                carrierCode: "LH",
                number: "1027",
                aircraft: { code: "321" },
                bookingStatus: "CONFIRMED",
                segmentType: "ACTIVE",
                isFlown: false,
                id: "1",
                numberOfStops: 0,
              },
            ],
          },
          {
            segments: [
              {
                departure: {
                  iataCode: "FRA",
                  terminal: "1",
                  at: "2025-12-02T08:10:00",
                },
                arrival: {
                  iataCode: "CDG",
                  terminal: "1",
                  at: "2025-12-02T09:25:00",
                },
                carrierCode: "LH",
                number: "1028",
                aircraft: { code: "319" },
                bookingStatus: "CONFIRMED",
                segmentType: "ACTIVE",
                isFlown: false,
                id: "2",
                numberOfStops: 0,
              },
            ],
          },
        ],
        price: {
          currency: "NGN",
          total: "1412889.00",
          base: "650560.00",
          grandTotal: "1412889.00",
        },
        pricingOptions: { fareType: ["PUBLISHED"] },
        validatingAirlineCodes: ["LH"],
        travelerPricings: [
          {
            travelerId: "1",
            fareOption: "STANDARD",
            travelerType: "CHILD",
            price: {
              currency: "NGN",
              total: "430199.00",
              base: "178030.00",
              taxes: [
                { amount: "19733.00", code: "DE" },
                { amount: "30266.00", code: "FR" },
                { amount: "12438.00", code: "NG" },
                { amount: "12313.00", code: "O4" },
                { amount: "25840.00", code: "OY" },
                { amount: "23211.00", code: "QX" },
                { amount: "57652.00", code: "RA" },
                { amount: "41598.00", code: "YQ" },
                { amount: "29118.00", code: "YR" },
              ],
            },
            fareDetailsBySegment: [
              {
                segmentId: "1",
                fareBasis: "KEUCLSP3",
                class: "K",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
              {
                segmentId: "2",
                fareBasis: "SEUCLSP0",
                class: "S",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
            ],
          },
          {
            travelerId: "2",
            fareOption: "STANDARD",
            travelerType: "ADULT",
            price: {
              currency: "NGN",
              total: "491345.00",
              base: "236265.00",
              taxes: [
                { amount: "19733.00", code: "DE" },
                { amount: "30266.00", code: "FR" },
                { amount: "15349.00", code: "NG" },
                { amount: "12313.00", code: "O4" },
                { amount: "25840.00", code: "OY" },
                { amount: "23211.00", code: "QX" },
                { amount: "57652.00", code: "RA" },
                { amount: "41598.00", code: "YQ" },
                { amount: "29118.00", code: "YR" },
              ],
            },
            fareDetailsBySegment: [
              {
                segmentId: "1",
                fareBasis: "KEUCLSP3",
                class: "K",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
              {
                segmentId: "2",
                fareBasis: "SEUCLSP0",
                class: "S",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
            ],
          },
          {
            travelerId: "3",
            fareOption: "STANDARD",
            travelerType: "ADULT",
            price: {
              currency: "NGN",
              total: "491345.00",
              base: "236265.00",
              taxes: [
                { amount: "19733.00", code: "DE" },
                { amount: "30266.00", code: "FR" },
                { amount: "15349.00", code: "NG" },
                { amount: "12313.00", code: "O4" },
                { amount: "25840.00", code: "OY" },
                { amount: "23211.00", code: "QX" },
                { amount: "57652.00", code: "RA" },
                { amount: "41598.00", code: "YQ" },
                { amount: "29118.00", code: "YR" },
              ],
            },
            fareDetailsBySegment: [
              {
                segmentId: "1",
                fareBasis: "KEUCLSP3",
                class: "K",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
              {
                segmentId: "2",
                fareBasis: "SEUCLSP0",
                class: "S",
                includedCheckedBags: { quantity: 1 },
                mealServices: [{ label: "Refreshments" }],
              },
            ],
          },
        ],
      },
    ],
    travelers: [
      {
        id: "1",
        gender: "FEMALE",
        name: { firstName: "HEIKE", lastName: "MUSTERMANN" },
        contact: {
          purpose: "STANDARD",
          phones: [
            { deviceType: "MOBILE", countryCallingCode: "33", number: "480080077" },
          ],
          emailAddress: "HEIKE@MUSTERMANN.COM",
        },
      },
      {
        id: "2",
        gender: "FEMALE",
        name: { firstName: "JENNIFER", lastName: "MUSTERMANN" },
        contact: {
          purpose: "STANDARD",
          phones: [
            { deviceType: "MOBILE", countryCallingCode: "33", number: "480080076" },
          ],
          emailAddress: "JENNIFER@MUSTERMANN.COM",
        },
      },
      {
        id: "3",
        gender: "MALE",
        name: { firstName: "MARTIN", lastName: "MUSTERMANN" },
        contact: {
          purpose: "STANDARD",
          phones: [
            { deviceType: "MOBILE", countryCallingCode: "33", number: "480080075" },
          ],
          emailAddress: "MARTIN@MUSTERMANN.COM",
        },
      },
    ],
    remarks: {
      general: [
        {
          subType: "GENERAL_MISCELLANEOUS",
          text: "PRICING ENTRY FXP/FF-CLASSIC/R,P,VC-LH,FC-NGN/P1-3",
          flightOfferIds: ["1"],
        },
      ],
      airline: [
        {
          subType: "OTHER_SERVICE",
          airlineCode: "1A",
          text: "PLS ADV TKT NBR BY 14NOV25/1527Z OR LHG SEG WILL BE CANX / APPLIC FARE RULE APPLIES IF IT DEMANDS EARLIER",
          flightOfferIds: ["1"],
        },
        {
          subType: "OTHER_SERVICE",
          airlineCode: "1A",
          text: "/// TKTG",
          flightOfferIds: ["1"],
        },
      ],
    },
    ticketingAgreement: { option: "CONFIRM" },
    contacts: [
      {
        addresseeName: { firstName: "MANZO TRAVELS & TOURS LTD" },
        address: {
          lines: ["SUIT NO 002 ADAMAWA PLAZA, CENTRAL"],
          postalCode: "900211",
          countryCode: "NG",
          cityName: "ABUJA",
        },
        purpose: "STANDARD",
        emailAddress: "MANZOTRAVELS@GMAIL.COM",
      },
      {
        addresseeName: { firstName: "MANZO TRAVELS & TOURS LTD" },
        address: {
          lines: ["SUIT NO 002 ADAMAWA PLAZA, CENTRAL"],
          postalCode: "900211",
          countryCode: "NG",
          cityName: "ABUJA",
        },
        purpose: "INVOICE",
      },
    ],
  },
  dictionaries: {
    locations: {
      FRA: { cityCode: "FRA", countryCode: "DE" },
      CDG: { cityCode: "PAR", countryCode: "FR" },
    },
  },
} as const;

export type SampleFlightOrderResponse = typeof SAMPLE_FLIGHT_ORDER_RESPONSE;
