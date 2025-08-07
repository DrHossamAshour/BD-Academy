import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books & Resources - BigDentist Academy",
  description: "Comprehensive collection of dental books, guides, and educational resources for dental professionals. Download PDF books, study materials, and clinical references.",
  keywords: "dental books, dental education, dental guides, dental resources, dental textbooks, clinical references",
  openGraph: {
    title: "Books & Resources - BigDentist Academy",
    description: "Comprehensive collection of dental books and educational resources",
    type: "website",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}