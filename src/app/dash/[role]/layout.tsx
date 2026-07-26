import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashClient from "./DashClient";

export default async function DashRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/login");
  }

  const validRoles = ["admin", "operator", "partner", "cert", "center"];
  if (!validRoles.includes(role)) {
    redirect("/dash/admin");
  }

  return <>{children}</>;
}
