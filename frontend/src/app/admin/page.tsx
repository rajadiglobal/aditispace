"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type DashboardStats = {
  leads: { total: number; new: number };
  customers: { total: number };
  requirements: { pending: number };
  projects: { active: number };
  quotations: { pending: number };
  appointments: { upcoming: number };
  tasks: { pending: number };
  products: { total: number; active: number };
};

type ContactInquiry = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
};

type Consultation = {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
};

type Subscriber = {
  id: string;
  email: string;
  source: string;
  status: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, contactsRes, consultRes, subsRes] = await Promise.all([
          api.get('/api/v1/dashboard/stats'),
          api.get('/api/v1/contact'),
          api.get('/api/v1/consultations'),
          api.get('/api/v1/newsletter')
        ]);
        
        setStats(statsRes.data);
        setContacts(contactsRes.data.slice(0, 5));
        setConsultations(consultRes.data.slice(0, 5));
        setSubscribers(subsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-500">Failed to load statistics.</div>;
  }

  const statCards = [
    { title: "Total Leads", value: stats.leads.total, sub: `${stats.leads.new} new`, href: "/admin/leads", icon: "📋", color: "bg-blue-50 text-blue-600" },
    { title: "Total Customers", value: stats.customers.total, href: "/admin/customers", icon: "👥", color: "bg-indigo-50 text-indigo-600" },
    { title: "Pending Requirements", value: stats.requirements.pending, href: "/admin/requirements", icon: "📝", color: "bg-yellow-50 text-yellow-600" },
    { title: "Active Projects", value: stats.projects.active, href: "/admin/projects?status=active", icon: "🏗️", color: "bg-green-50 text-green-600" },
    { title: "Pending Quotations", value: stats.quotations.pending, href: "/admin/quotations", icon: "📄", color: "bg-orange-50 text-orange-600" },
    { title: "Upcoming Appointments", value: stats.appointments.upcoming, href: "/admin/appointments", icon: "📅", color: "bg-purple-50 text-purple-600" },
    { title: "Pending Tasks", value: stats.tasks.pending, href: "/admin/tasks", icon: "✓", color: "bg-red-50 text-red-600" },
    { title: "Total Products", value: stats.products.total, sub: `${stats.products.active} active`, href: "/admin/products", icon: "🛋️", color: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what's happening across the business.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/leads/new" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            + Quick Lead
          </Link>
          <Link href="/admin/requirements/new" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition shadow-sm shadow-primary/20">
            + New Requirement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.href} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">{card.value}</h3>
                {card.sub && <p className="text-xs text-gray-500 mt-2 font-medium">{card.sub}</p>}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Contact Inquiries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Contact Inquiries</h2>
            <Link href="/admin/contact" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contact inquiries yet.</p>
          ) : (
            <div className="space-y-4">
              {contacts.map(contact => (
                <div key={contact.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{contact.first_name} {contact.last_name}</p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${contact.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {contact.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Consultations</h2>
            <Link href="/admin/consultations" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          {consultations.length === 0 ? (
            <p className="text-gray-500 text-sm">No consultations yet.</p>
          ) : (
            <div className="space-y-4">
              {consultations.map(consult => (
                <div key={consult.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{consult.name}</p>
                    <p className="text-xs text-gray-500">{consult.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${consult.status === 'requested' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {consult.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Newsletter Subscriptions</h2>
            <Link href="/admin/newsletter" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-gray-500 text-sm">No subscribers yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribers.map(sub => (
                <div key={sub.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Source: {sub.source}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${sub.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
