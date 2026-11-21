import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

// 02 §1 & §3: dashboard layout is a server component that guards the session
// and supplies the role-aware sidebar without inheriting the site navbar/footer.
export default async function DashboardLayout({ children }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full bg-[#111111]">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 min-w-0 bg-background border-t border-l border-border rounded-tl-[22px] rounded-tr-[22px] sm:rounded-tr-none mt-14 lg:mt-2 mr-0 sm:mr-2 p-5 sm:p-7 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
