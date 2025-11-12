import DashboardShell from "@/components/dashboard/role-based/DashboardShell";
import RetrieveTicketScreen from "@/components/bookings/retrieve/RetrieveTicketScreen";

export default function MainAdminBookingsPage() {
  return (
    <DashboardShell role="main-admin">
      <RetrieveTicketScreen />
    </DashboardShell>
  );
}
