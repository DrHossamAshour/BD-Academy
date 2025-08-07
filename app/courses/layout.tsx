import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dental Courses - BigDentist Academy',
  description: 'Browse our comprehensive collection of dental courses. Learn dentistry online with expert instructors and get certified in various dental specialties.',
  keywords: ['dental courses', 'online dentistry', 'dental education', 'dental training', 'dental certification', 'dental specialties'],
  openGraph: {
    title: 'Dental Courses - BigDentist Academy',
    description: 'Browse our comprehensive collection of dental courses. Learn dentistry online with expert instructors and get certified.',
    type: 'website',
    url: 'https://bigdentist.academy/courses',
    images: [
      {
        url: '/images/courses-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BigDentist Academy Courses'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dental Courses - BigDentist Academy',
    description: 'Browse our comprehensive collection of dental courses. Learn dentistry online with expert instructors.',
    images: ['/images/courses-og.jpg']
  }
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}