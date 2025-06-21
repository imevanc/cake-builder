import type { Metadata } from "next";
import { AuthProvider, BasketProvider } from "@/contexts";
import { Toaster } from "@/components/ui";
import { Footer, Navbar } from "@/components/common";
import "./global.css";

export const metadata: Metadata = {
  title: "Cake Creation Station",
  description: "Design and order your perfect cake!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <BasketProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </BasketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
