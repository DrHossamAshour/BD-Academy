import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diplomas & Certifications - BigDentist Academy", 
  description: "Earn recognized diplomas and certifications in dental specializations. Professional certificates to validate your expertise and advance your dental career.",
  keywords: "dental diplomas, dental certifications, dental certificates, professional credentials, dental specialization",
  openGraph: {
    title: "Diplomas & Certifications - BigDentist Academy",
    description: "Earn recognized diplomas and certifications in dental specializations",
    type: "website",
  },
};

export default function DiplomasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}