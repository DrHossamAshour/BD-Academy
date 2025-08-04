use client;

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/"); // Redirect to home page after logout
  };

  // Optionally, determine dashboard link based on user role
  // For simplicity, redirect to /dashboard
  const dashboardLink = "/dashboard";

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#d8bf78] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">BigDentist</span>
                <span className="text-xs text-[#d8bf78] font-medium">EXCEL & SELL</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/books" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
              Books & Resources
            </Link>
            <Link href="/diplomas" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
              Diplomas
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
              All Courses
            </Link>
            <Link href="/courses?filter=monthly" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
              Monthly Courses
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? null : session?.user ? (
              <>
                <Button
                  className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                  asChild
                >
                  <Link href={dashboardLink}>Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link href="/books" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
                Books & Resources
              </Link>
              <Link href="/diplomas" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
                Diplomas
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
                All Courses
              </Link>
              <Link href="/courses?filter=monthly" className="text-gray-700 hover:text-[#d8bf78] transition-colors">
                Monthly Courses
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {status === "loading" ? null : session?.user ? (
                  <>
                    <Button
                      className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                      asChild
                    >
                      <Link href={dashboardLink}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white" asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}