import Header from "@/components/Header";
import CourseCarousel from "@/components/CourseCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedCourses from "@/components/FeaturedCourses";
import StatsSection from "@/components/StatsSection";
import InstructorsSection from "@/components/InstructorsSection";
import Footer from "@/components/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BigDentist Academy - Learn Dentistry Online',
  description: 'Master dentistry with our comprehensive online courses. Learn from industry experts, get certified, and advance your dental career with BigDentist Academy.',
  keywords: ['dentistry courses', 'online dental education', 'dental training', 'dental certification', 'dental academy'],
  authors: [{ name: 'BigDentist Academy' }],
  openGraph: {
    title: 'BigDentist Academy - Learn Dentistry Online',
    description: 'Master dentistry with our comprehensive online courses. Learn from industry experts, get certified, and advance your dental career.',
    type: 'website',
    url: 'https://bigdentist.academy',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BigDentist Academy - Online Dental Education'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigDentist Academy - Learn Dentistry Online',
    description: 'Master dentistry with our comprehensive online courses. Learn from industry experts, get certified, and advance your dental career.',
    images: ['/images/og-image.jpg']
  },
  robots: 'index, follow'
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
