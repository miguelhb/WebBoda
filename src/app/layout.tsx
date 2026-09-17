import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conchi & Miguel",
  description:
    "Boda de Conchi y Miguel: confirmación, plan del día, regalos, canciones e historia."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
