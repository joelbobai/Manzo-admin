import DashboardShell from "@/components/dashboard/role-based/DashboardShell";
import RetrieveTicketScreen from "@/components/bookings/retrieve/RetrieveTicketScreen";

export default function SubAdminBookingsPage() {
  return (
    <DashboardShell role="sub-admin">
      <RetrieveTicketScreen />
    </DashboardShell>
  );
}
