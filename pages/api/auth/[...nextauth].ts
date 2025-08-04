import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Email({
      // ... your email provider configuration
    }),
    // Add other providers here
  ],
  callbacks: {
    async session(session, user) {
      // Attach user's role to the session
      session.user.role = user.role;
      return session;
    },
    async redirect(url, baseUrl) {
      // Redirect users to /role-redirect after login
      return '/role-redirect';
    },
  },
  // ... other NextAuth options
});