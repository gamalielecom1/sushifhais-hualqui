import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sushi Fhais — El fascinante sabor del sushi",
  description:
    "Regístrate gratis y sé de los primeros en enterarte del lanzamiento de Sushi Fhais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
