import type { Metadata } from "next";
import "./globals.css";
//import "sweetalert2/src/sweetalert2.scss";
import Providers from "@/lib/Providers/Providers";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Admin Dashboard | United Threads ",
  description: "Generated by create next app",
};

const uncutSans = localFont({
  src: "../assets/UncutSans-Variable.woff2",

  display: "block",
  variable: "--font-uncut-sans",
  weight: "200 800",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='shortcut icon'
          href='/favicon-black.svg'
          type='image/x-icon'
          media='(prefers-color-scheme: light)'
        />
        <link
          rel='shortcut icon'
          href='/favicon-white.svg'
          type='image/x-icon'
          media='(prefers-color-scheme: dark)'
        />
      </head>
      <body className={`${uncutSans.className}  antialiased bg-[#232323]`}>
        <Providers>
          <NextTopLoader color='#F8FAFC' />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
