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
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${card.iconWrapperClass}`}
              >
                <card.icon />
              </div>
            </div>

            <div
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${card.badge.containerClass}`}
            >
              <TrendArrow direction={card.badge.direction} className={card.badge.iconClass} />
              <span>{card.badge.label}</span>
            </div>
          </article>
        ))}
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

