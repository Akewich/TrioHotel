// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error("Login failed with status:", res.status);
            return null;
          }

          const data = await res.json();

          // Debug: Log what we received
          console.log("Backend response:", data);

          // Check if login was successful
          if (!data.customer || !data.token) {
            console.error("Login unsuccessful");
            return null;
          }

          // Extract user data from the response
          // Your backend returns: { success, message, token, user: { id, username, email } }
          return {
            // id: data.id || "", // ถ้า backend ไม่มี id ให้ fallback
            // email: data.email || credentials.email,
            // username: data.username || "",
            // accessToken: data.token || "",
            id: data.customer.id,
            name: data.customer.name, // 👈 ใส่ name ตรงนี้
            email: data.customer.email,
            username: data.customer.username,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token.id = user.id;
        // token.email = user.email;
        // token.username = user.username;
        // token.accessToken = user.accessToken;
        // token.name = user.username;
        token.id = user.id;
        token.name = user.name; // ✅ ใส่ name
        token.email = user.email;
        token.username = user.username;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string; // ✅ map กลับไป
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
