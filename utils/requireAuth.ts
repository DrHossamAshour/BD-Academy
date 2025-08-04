import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Server-side authentication utility for Next.js pages using NextAuth.js
 * Usage:
 *   export const getServerSideProps = requireAuth();
 *   export const getServerSideProps = requireAuth("admin");
 *   export const getServerSideProps = requireAuth(["admin", "instructor"]);
 */
export function requireAuth(roles?: string[] | string) {
  return async (context: any) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    }

    // Optional: enforce role-based access
    if (roles) {
      const allowed = Array.isArray(roles) ? roles : [roles];
      // Adjust according to your user model
      if (!allowed.includes(session.user.role)) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    return { props: { session } };
  };
}