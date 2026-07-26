import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const ROLE_TO_URL: Record<string, string> = {
  admin: "/dash/admin",
  operator: "/dash/operator",
  oem_partner: "/dash/partner",
  cert_authority: "/dash/cert",
  print_center: "/dash/center",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    redirect("/login");
  }
  const target = ROLE_TO_URL[session.user.role] || "/dash/admin";
  redirect(target);
}
