import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Courses - BigDentist Academy",
  description: "Browse our complete catalog of dental courses. From beginner to advanced levels, find the perfect course to advance your dental practice and professional skills.",
  keywords: "dental courses, dental training, online dental education, dental certification, dental continuing education",
  openGraph: {
    title: "All Courses - BigDentist Academy", 
    description: "Browse our complete catalog of dental courses",
    type: "website",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}