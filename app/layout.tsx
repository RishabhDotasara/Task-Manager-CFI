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
  title: "CFI",
  description: "CFI Task Manager",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "Rishabh",
      url: "https://www.linkedin.com/in/imvinojanv/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
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
