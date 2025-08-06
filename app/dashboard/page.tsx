"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Redirect based on user role
    const role = session.user.role;
    switch (role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "instructor":
        router.push("/dashboard/instructor");
        break;
      case "student":
        router.push("/dashboard/student");
        break;
      default:
        router.push("/dashboard/student"); // Default fallback
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d8bf78] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 