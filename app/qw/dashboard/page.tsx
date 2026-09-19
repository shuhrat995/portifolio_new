import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getProfile, getProjects } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/qw");
  }

  const [profile, projects] = await Promise.all([getProfile(), getProjects(true)]);

  return (
    <AdminDashboard
      initialProfile={profile}
      initialProjects={projects}
    />
  );
}
