import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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
  title: "INT Tools - Ferramentas e Equipamentos Profissionais",
  description: "Loja especializada em ferramentas profissionais e equipamentos de qualidade. Entrega para todo Brasil.",
  keywords: "ferramentas, equipamentos, ferramentas profissionais, loja de ferramentas",
  authors: [{ name: "INT Tools" }],
  openGraph: {
    title: "INT Tools - Ferramentas Profissionais",
    description: "Ferramentas e equipamentos de qualidade com entrega para todo Brasil",
    url: "https://www.inttools.com.br",
    siteName: "INT Tools",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
