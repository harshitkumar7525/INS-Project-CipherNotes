import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("token")?.value;
  let email: string | undefined;
  try { if (token) email = verifyToken(token).email; } catch {}
  return (
    <div className="flex">
      <Sidebar email={email} />
      <div className="flex-1 min-h-screen">{children}</div>
    </div>
  );
}
