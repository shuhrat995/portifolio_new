import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAuthenticated, usingDefaultPassword } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin access",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/qw/dashboard");
  }

  return <LoginForm usingDefault={usingDefaultPassword()} />;
}
