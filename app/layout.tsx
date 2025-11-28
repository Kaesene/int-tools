import type { Metadata } from "next";
import "./globals.css";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { CartProvider } from "@/contexts/CartContext";

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
        <CartProvider>
          <StoreLayout>{children}</StoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}
