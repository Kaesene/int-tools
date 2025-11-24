import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "INT Tools - Ferramentas e Tecnologia Importada",
  description: "Sua loja especializada em ferramentas profissionais e tecnologia importada de alta qualidade.",
  keywords: "ferramentas, tecnologia, importados, ferramentas elétricas, ferramentas manuais, gadgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
