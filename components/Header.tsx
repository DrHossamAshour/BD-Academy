"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Home } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { HeaderProps } from "@/types/components";

interface NavItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/books", label: "Books" },
  { href: "/diplomas", label: "Diplomas" },
];

export default function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true);
    
    // Show auth buttons after a short delay to prevent long loading
    const timer = setTimeout(() => {
      setShowAuthButtons(true);
    }, 1000); // Show buttons after 1 second even if session is still loading

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/"); // Redirect to home page after logout
  };

  // Check if we're on a dashboard page
  const isOnDashboard = pathname?.startsWith('/dashboard');
  
  // Determine the appropriate button text and link
  const getDashboardButton = () => {
    if (isOnDashboard) {
      return {
        text: "Go to Site",
        href: "/",
        icon: Home
      };
    } else {
      return {
        text: "Dashboard",
        href: "/dashboard",
        icon: null
      };
    }
  };

  const dashboardButton = getDashboardButton();

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
            {!isClient || (status === "loading" && !showAuthButtons) ? (
              // Show loading state instead of hiding completely
              <div className="flex items-center space-x-3">
                <div className="w-20 h-9 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-16 h-9 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            ) : session?.user ? (
              <>
                <Button
                  className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                  asChild
                >
                  <Link href={dashboardButton.href}>
                    {dashboardButton.icon && <dashboardButton.icon className="w-4 h-4 mr-2" />}
                    {dashboardButton.text}
                  </Link>
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
                {!isClient || (status === "loading" && !showAuthButtons) ? (
                  // Show loading state for mobile menu
                  <div className="flex flex-col space-y-2">
                    <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                ) : session?.user ? (
                  <>
                    <Button
                      className="bg-[#d8bf78] hover:bg-[#c4a86a] text-white"
                      asChild
                    >
                      <Link href={dashboardButton.href}>
                        {dashboardButton.icon && <dashboardButton.icon className="w-4 h-4 mr-2" />}
                        {dashboardButton.text}
                      </Link>
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