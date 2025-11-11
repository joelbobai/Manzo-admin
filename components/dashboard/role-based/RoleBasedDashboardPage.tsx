import type { JSX } from "react";

import DashboardShell, {
  DashboardRole,
} from "@/components/dashboard/role-based/DashboardShell";

type DashboardCard = {
  title: string;
  value: string;
  icon: () => JSX.Element;
  iconWrapperClass: string;
  badge: {
    direction: "up" | "down";
    label: string;
    containerClass: string;
    iconClass: string;
  };
};

const dashboardCards: DashboardCard[] = [
  {
    title: "Completed Flights",
    value: "125",
    icon: CompletedFlightsIcon,
    iconWrapperClass: "bg-[#EBDCA8]",
    badge: {
      direction: "up",
      label: "1.25%",
      containerClass: "bg-[#F6EDDA] text-[#1C1C1C]",
      iconClass: "text-[#C1901D]",
    },
  },
  {
    title: "Active Flights",
    value: "80",
    icon: ActiveFlightsIcon,
    iconWrapperClass: "bg-[#EBDCA8]",
    badge: {
      direction: "up",
      label: "3.68%",
      containerClass: "bg-[#F6EDDA] text-[#1C1C1C]",
      iconClass: "text-[#C1901D]",
    },
  },
  {
    title: "Canceled Flights",
    value: "25",
    icon: CanceledFlightsIcon,
    iconWrapperClass: "bg-[#EBDCA8]",
    badge: {
      direction: "down",
      label: "1.45%",
      containerClass: "bg-[#1F1F1F] text-white",
      iconClass: "text-white",
    },
  },
  {
    title: "Total Revenue",
    value: "$15,000",
    icon: RevenueIcon,
    iconWrapperClass: "bg-[#EBDCA8]",
    badge: {
      direction: "up",
      label: "5.94%",
      containerClass: "bg-[#F6EDDA] text-[#1C1C1C]",
      iconClass: "text-[#C1901D]",
    },
  },
];

const ticketSalesData = [
  { day: "Sun", sold: 2600, total: 3200 },
  { day: "Mon", sold: 3100, total: 3600 },
  { day: "Tue", sold: 4000, total: 4000 },
  { day: "Wed", sold: 3400, total: 3800 },
  { day: "Thu", sold: 3000, total: 3600 },
  { day: "Fri", sold: 2800, total: 3400 },
  { day: "Sat", sold: 2200, total: 3000 },
];

const ticketSalesMax = Math.max(...ticketSalesData.map((entry) => entry.total));

const flightsScheduleMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
] as const;

const domesticFlights = [140, 150, 130, 160, 170, 140, 150, 155];
const internationalFlights = [110, 120, 115, 130, 150, 140, 135, 145];
const flightsMax = 200;

const CHART_WIDTH = 360;
const CHART_HEIGHT = 200;

const domesticPath = buildLinePath(domesticFlights, flightsMax, CHART_WIDTH, CHART_HEIGHT);
const internationalPath = buildLinePath(internationalFlights, flightsMax, CHART_WIDTH, CHART_HEIGHT);

export default function RoleBasedDashboardPage({ role }: { role: DashboardRole }) {
  return (
    <DashboardShell role={role}>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="flex h-full flex-col justify-between rounded-[24px] border border-[#F0EDE6] bg-white p-6 shadow-[0px_16px_40px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#6E6E6E]">{card.title}</p>
                <p className="text-4xl font-semibold text-[#1A1A1A]">{card.value}</p>
              </div>
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${card.iconWrapperClass}`}>
                <card.icon />
              </div>
            </div>

            <div className={`mt-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${card.badge.containerClass}`}>
              <TrendArrow direction={card.badge.direction} className={card.badge.iconClass} />
              <span>{card.badge.label}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <TicketSalesCard />
        <FlightsScheduleCard />
      </section>
    </DashboardShell>
  );
}

function TrendArrow({
  direction,
  className,
}: {
  direction: "up" | "down";
  className?: string;
}) {
  if (direction === "down") {
    return (
      <svg
        className={`h-4 w-4 ${className ?? ""}`}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 5.5L11 12M11 8.5V12H7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`h-4 w-4 ${className ?? ""}`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 10.5L11 4M11 7.5V4H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompletedFlightsIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#1A1A1A]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12.5L9 16.5L19 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActiveFlightsIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#1A1A1A]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12L21 5L17 19L11.5 13.5L7 18L6 12L3 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CanceledFlightsIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#1A1A1A]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7L17 17M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg
      className="h-6 w-6 text-[#1A1A1A]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4V20M8 8.5C8 6.84315 9.34315 5.5 11 5.5H13C14.6569 5.5 16 6.84315 16 8.5C16 10.1569 14.6569 11.5 13 11.5H11C9.34315 11.5 8 12.8431 8 14.5C8 16.1569 9.34315 17.5 11 17.5H13C14.6569 17.5 16 16.1569 16 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TicketSalesCard() {
  return (
    <article className="rounded-[24px] border border-[#F0EDE6] bg-white p-6 shadow-[0px_16px_40px_rgba(15,23,42,0.08)]">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Ticket Sales</h2>
          <div>
            <p className="text-4xl font-semibold text-[#1A1A1A]">12,500</p>
            <p className="text-sm text-[#6E6E6E]">Tickets Sold</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#E2C269] px-4 py-2 text-xs font-semibold text-[#1C1C1C] shadow-[0px_8px_20px_rgba(26,26,26,0.08)]">
          <span>This Week</span>
          <svg
            className="h-3.5 w-3.5 text-[#1C1C1C]"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3L9 7L5 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <div className="mt-6 flex gap-6">
        <div className="flex flex-col justify-between pb-1 text-xs font-medium text-[#9E9E9E]">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = ((4 - index) * ticketSalesMax) / 4;
            return (
              <span key={index} className="leading-none">
                {value >= 1000 ? `${value / 1000}k` : value}
              </span>
            );
          })}
        </div>
        <div className="flex flex-1 items-end justify-between gap-4">
          {ticketSalesData.map((entry) => {
            const soldHeight = (entry.sold / ticketSalesMax) * 100;
            const totalHeight = (entry.total / ticketSalesMax) * 100;

            return (
              <div key={entry.day} className="flex flex-col items-center gap-3">
                <div className="relative flex h-48 w-10 items-end justify-center">
                  <div className="relative h-full w-3.5 rounded-full bg-[#E8E8E8]">
                    <div
                      className="absolute bottom-0 left-0 right-0 mx-auto w-full rounded-full bg-[#1C1C1C]"
                      style={{ height: `${soldHeight}%` }}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 mx-auto w-full rounded-full border border-white/60"
                      style={{ height: `${totalHeight}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-[#6E6E6E]">{entry.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function buildLinePath(data: number[], maxValue: number, width: number, height: number) {
  if (data.length === 0) {
    return "";
  }

  const stepX = width / (data.length - 1);

  return data
    .map((value, index) => {
      const x = index * stepX;
      const y = height - (value / maxValue) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function FlightsScheduleCard() {
  const tooltipIndex = 4;
  const tooltipMonth = flightsScheduleMonths[tooltipIndex];
  const tooltipValue = domesticFlights[tooltipIndex];
  const tooltipLeft = (tooltipIndex / (flightsScheduleMonths.length - 1)) * 100;
  const tooltipTop = 100 - (tooltipValue / flightsMax) * 100;

  return (
    <article className="rounded-[24px] border border-[#F0EDE6] bg-white p-6 shadow-[0px_16px_40px_rgba(15,23,42,0.08)]">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Flights Schedule</h2>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-[#1A1A1A]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#E2C269]" />
              <span>Domestic</span>
            </div>
            <div className="flex items-center gap-2 text-[#1A1A1A]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#1C1C1C]" />
              <span>International</span>
            </div>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-[#E2C269] px-4 py-2 text-xs font-semibold text-[#1C1C1C] shadow-[0px_8px_20px_rgba(26,26,26,0.08)]">
          <span>Last 8 Months</span>
          <svg
            className="h-3.5 w-3.5 text-[#1C1C1C]"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3L9 7L5 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <div className="mt-6 flex gap-6">
        <div className="flex flex-col justify-between pb-4 text-xs font-medium text-[#9E9E9E]">
          {[200, 150, 100, 50, 0].map((value) => (
            <span key={value} className="leading-none">
              {value}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-56 w-full"
            preserveAspectRatio="none"
          >
            {[1, 2, 3].map((line) => {
              const y = (CHART_HEIGHT / 4) * line;
              return (
                <line
                  key={line}
                  x1={0}
                  x2={CHART_WIDTH}
                  y1={y}
                  y2={y}
                  stroke="#F0F0F0"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              );
            })}
            <path
              d={domesticPath}
              fill="none"
              stroke="#E2C269"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={internationalPath}
              fill="none"
              stroke="#1C1C1C"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div
            className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center gap-2"
            style={{ left: `${tooltipLeft}%`, top: `calc(${tooltipTop}% - 12px)` }}
          >
            <div className="rounded-full border-4 border-white bg-[#E2C269] p-1 shadow-[0px_8px_20px_rgba(26,26,26,0.12)]" />
            <div className="rounded-full bg-[#1C1C1C] px-3 py-1 text-xs font-semibold text-white shadow-[0px_8px_20px_rgba(26,26,26,0.12)]">
              <div>{tooltipMonth} 2023</div>
              <div className="text-[10px] font-medium text-white/70">{tooltipValue} flights</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-8 text-center text-xs font-medium text-[#6E6E6E]">
        {flightsScheduleMonths.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </article>
  );
}
