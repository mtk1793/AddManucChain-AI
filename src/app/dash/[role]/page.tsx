import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashClientRolePage from "./DashClient";

const ROLE_TO_URL: Record<string, string> = {
  admin: "admin",
  operator: "operator",
  oem_partner: "partner",
  cert_authority: "cert",
  print_center: "center",
};

export default async function DashRolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/login");
  }

  const expectedUrl = ROLE_TO_URL[session.user.role];
  if (expectedUrl && expectedUrl !== role) {
    redirect(`/dash/${expectedUrl}`);
  }

  return <DashClientRolePage />;
}
