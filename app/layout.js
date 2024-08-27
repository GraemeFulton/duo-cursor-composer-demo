import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Duolingo Clone made with Cursor Composer and Claude AI",
  description: "A demo language learning app created to explore Cursor Composer and Claude AI capabilities",
  openGraph: {
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Duolingo Clone',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
