import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import GlobalSearch from "@/components/admin/GlobalSearch"
import Link from "next/link"

export const metadata = {
  title: "Admin | Avyron Studio CRM",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  if (session.user?.role !== "admin" && session.user?.role !== "staff") {
    redirect("/unauthorized")
  }

  // Define navigation grouped by categories
  const navGroups = [
    {
      title: "CRM",
      items: [
        { href: "/admin", label: "Dashboard", id: "nav-dashboard" },
        { href: "/admin/leads", label: "Leads", id: "nav-leads" },
        { href: "/admin/customers", label: "Customers", id: "nav-customers" },
        { href: "/admin/requirements", label: "Requirements", id: "nav-requirements" },
        { href: "/admin/activities", label: "Activities", id: "nav-activities" },
      ]
    },
    {
      title: "Website Submissions",
      items: [
        { href: "/admin/consultations", label: "Recent Consultations", id: "nav-consultations" },
        { href: "/admin/contact", label: "Recent Contact Inquiries", id: "nav-contact" },
        { href: "/admin/newsletter", label: "Recent Subscriptions", id: "nav-newsletter" },
      ]
    },
    {
      title: "Projects",
      items: [
        { href: "/admin/projects", label: "All Projects", id: "nav-projects" },
        { href: "/admin/projects?status=active", label: "Active Projects", id: "nav-projects-active" },
        { href: "/admin/projects?status=completed", label: "Completed Projects", id: "nav-projects-completed" },
      ]
    },
    {
      title: "Products",
      items: [
        { href: "/admin/products", label: "Products", id: "nav-products" },
        { href: "/admin/categories", label: "Categories", id: "nav-categories" },
        { href: "/admin/collections", label: "Collections", id: "nav-collections" },
        { href: "/admin/brands", label: "Brands", id: "nav-brands" },
      ]
    },
    {
      title: "Sales",
      items: [
        { href: "/admin/quotations", label: "Quotations", id: "nav-quotations" },
        { href: "/admin/payments", label: "Payments", id: "nav-payments" },
      ]
    },
    {
      title: "Operations",
      items: [
        { href: "/admin/appointments", label: "Appointments", id: "nav-appointments" },
        { href: "/admin/tasks", label: "Tasks", id: "nav-tasks" },
        { href: "/admin/documents", label: "Documents", id: "nav-documents" },
      ]
    },
    {
      title: "Communication",
      items: [
        { href: "/admin/notifications", label: "Notifications", id: "nav-notifications" },
      ]
    },
    {
      title: "Team",
      items: [
        { href: "/admin/workers", label: "Staff", id: "nav-workers" }, // workers is the existing staff route
        { href: "/admin/roles", label: "Roles & Permissions", id: "nav-roles" },
      ]
    },
    {
      title: "System",
      items: [
        { href: "/admin/analytics", label: "Analytics", id: "nav-analytics" },
        { href: "/admin/settings", label: "Settings", id: "nav-settings" },
      ]
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f] text-white flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-[#1f1f1f] sticky top-0 bg-[#0f0f0f] z-10">
          <p className="text-[11px] text-[#888] uppercase tracking-widest mb-1">
            Avyron Studio
          </p>
          <Link href="/admin">
            <p className="text-sm font-semibold text-white hover:text-primary transition-colors">CRM Dashboard</p>
          </Link>
        </div>

        <nav className="p-4 flex flex-col gap-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {group.title}
              </h3>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    id={item.id}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-[#ccc] text-sm font-medium hover:bg-[#1f1f1f] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-[#1f1f1f] bg-[#0f0f0f] sticky bottom-0">
          <p className="text-xs text-[#888] mb-1">Signed in as</p>
          <p className="text-sm text-[#ddd] font-medium truncate">
            {session.user?.name || session.user?.email}
          </p>
          <p className="text-xs text-[#666] mt-1 capitalize">
            {session.user?.role}
          </p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex-1 flex items-center max-w-2xl">
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
