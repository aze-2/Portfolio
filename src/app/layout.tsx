import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./supabase-AuthProvider";
import { getUser } from "./supabase-GetUser";
import Providers from "./chakraProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Around Notes",
  description: "Home Around Notes for Portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      const { user, profile } = await getUser()
      console.log(user, profile)
  
  return (
    <html suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <AuthProvider user={{
           id: user?.id ?? '',
           email: user?.email ?? '',
          }}
          profile={profile}
        >
          {children}
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
