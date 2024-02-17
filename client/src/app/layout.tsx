import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppings = Poppins({ subsets: ["latin"] , weight:["200","300","400","500","600","700","800"]});

export const metadata: Metadata = {
  title: "MealGen",
  description: "Random desc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppings.className}>{children}</body>
    </html>
  );
}
