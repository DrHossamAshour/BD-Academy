import { Metadata } from "next";
import Header from "@/components/Header";
import CourseCarousel from "@/components/CourseCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedCourses from "@/components/FeaturedCourses";
import StatsSection from "@/components/StatsSection";
import InstructorsSection from "@/components/InstructorsSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BigDentist Academy - Excel & Sell | Professional Dental Courses",
  description: "Transform your dental practice with professional courses, training programs, and resources. Join thousands of dentists who excel and sell with BigDentist Academy.",
  keywords: "dental courses, dental training, dental education, dental practice management, dental marketing",
  openGraph: {
    title: "BigDentist Academy - Excel & Sell",
    description: "Professional dental courses and training programs",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <CourseCarousel />
      <CategoryGrid />
      <FeaturedCourses />
      <StatsSection />
      <InstructorsSection />
      <Footer />
    </main>
  );
}
