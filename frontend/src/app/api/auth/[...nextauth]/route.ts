import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      token?: string
      userId?: string
    } & DefaultSession["user"]
  }

  interface User {
    token?: string
    userId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string
    userId?: string
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Call backend to handle OAuth user and get JWT token
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HTTP_HOST}/auth/google/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            // Store JWT token in user object to be used in session callback
            user.token = data.data.token;
            user.userId = data.data.userId;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Pass the JWT token from the user object to the session
      if (token) {
        session.user.token = token.token;
        session.user.userId = token.userId;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Pass the JWT token from the user object to the JWT token
      if (user) {
        token.token = user.token;
        token.userId = user.userId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST }
