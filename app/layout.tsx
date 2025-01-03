import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Session from "@/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import RecoilProvider from "@/providers/recoil-provider";
import ReactQueryProvider from "@/providers/react-query-provider";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <ReactQueryProvider>
          <RecoilProvider>
            <Session>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <TooltipProvider>
                  <Toaster />
                  {children}
                </TooltipProvider>
              </ThemeProvider>
            </Session>
          </RecoilProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
