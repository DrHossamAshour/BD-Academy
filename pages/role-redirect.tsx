import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function RoleRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDashboard = async () => {
      const session = await getSession();
      if (!session || !session.user) {
        router.replace("/api/auth/signin");
        return;
      }
      const role = session.user.role;
      if (role === "admin") router.replace("/dashboard/admin");
      else if (role === "instructor") router.replace("/dashboard/instructor");
      else router.replace("/dashboard/student");
    };
    redirectToDashboard();
  }, [router]);

  return <div>Redirecting to your dashboard...</div>;
}