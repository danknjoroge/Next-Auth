import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider  from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import dbConnection from "@/lib/db";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        id:'credentials',
        name:"Credentials",
        credentials:{
            email:{label:'Email', type:'text'},
            password:{label:"Password", type:"password"}
        },

        async authorize(credentials:any) {
            await dbConnection();

            try {
                const user = await User.findOne({email:credentials.email});
            if (user) {
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (isPasswordCorrect) return user; 
            }
            } catch (error:any) {
                throw new Error(error)
            }
        }

    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string ,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
  async signIn({ user, account }: { user: AuthUser, account: Account | null }) {
    if (!account) {
      console.error("Account is null");
      return false;
    }

    if (account.provider === "credentials") {
      if (!user) {
        console.error("Invalid credentials");
        return false;
      }
      return true;
    }

    if (account.provider === "github") {
      try {
        await dbConnection();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            email: user.email,
          });
          await newUser.save();
        }
        return true;
      } catch (error) {
        console.error("Error during GitHub sign-in", error);
        return false;
      }
    }
    return false;
  },
}

  
}

export const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};