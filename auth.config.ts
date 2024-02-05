import type {Account, NextAuthConfig} from 'next-auth';
import getUser from "@/auth";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // if (account) {
      //   token.accessToken = account.access_token
      //   // @ts-ignore
      //   token.id = profile.id
      // }
      return token
    },
    // @ts-ignore
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // @ts-ignore
      session.accessToken = token.accessToken
      // @ts-ignore
      session.user.id = token.id

      return session
    },

    //  async jwt( {token, account, user, profile}: any) {
    //
    //
    //   console.log('jwt callbackt token param exists:', !!token) // true
    //   // console.log('jwt callback account param exists:', !!account) // false (bug)
    //   console.log('jwt callback token.account exists:', !!token.account) // true (workaround)
    //
    //   if (user) {
    //     token.username = user.name
    //   } else {
    //     // @ts-ignore
    //     user = await getUser(token.email ?? '');
    //
    //     if (user) {
    //       token.email = user.email
    //       token.name = user.name
    //       token.image = user.image
    //     }
    //     return token
    //   }
    // },
    // session: ({session, token}: any) => {
    //   if (token) {
    //     session.user.id = token.sub
    //     session.user.email = token.email
    //     session.user.name = token.name
    //     session.user.image = token.picture
    //   }
    //
    //   return session
    // }
    authorized({auth, request: {nextUrl}}) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
