import Header from "@/components/Header";
import CourseCarousel from "@/components/CourseCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedCourses from "@/components/FeaturedCourses";
import StatsSection from "@/components/StatsSection";
import InstructorsSection from "@/components/InstructorsSection";
import Footer from "@/components/Footer";

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
