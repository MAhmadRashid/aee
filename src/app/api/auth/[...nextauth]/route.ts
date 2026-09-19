import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
           throw new Error("Firebase configuration is missing");
        }

        // Authenticate with Firebase Identity Toolkit
        const firebaseRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: credentials.email, 
            password: credentials.password, 
            returnSecureToken: true 
          }),
        });

        const firebaseData = await firebaseRes.json();

        if (!firebaseRes.ok) {
          throw new Error("Invalid email or password");
        }
        
        return {
          id: firebaseData.localId,
          name: firebaseData.displayName || credentials.email.split('@')[0],
          email: firebaseData.email,
          role: 'admin', // Changed from 'user' to 'admin' for testing
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-local-dev-12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
