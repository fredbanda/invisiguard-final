import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavbarMain from "@/components/headers/nav-main";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/footers/footer";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Invisiguard | Security Solutions",
  description:
    "Invisiguard is a security solutions company that provides a comprehensive suite of security services to help businesses protect their digital assets.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <NavbarMain />
          <FpjsProvider
      loadOptions={{
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        apiKey: process.env.NEXT_PUBLIC_FINGERPRINTJS_API_KEY!,
        region: "us",
      }}
    >
          {children}
          </FpjsProvider>
          <Toaster richColors />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
