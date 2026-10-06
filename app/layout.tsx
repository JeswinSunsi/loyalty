import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M Souq Rewards",
  description: "Your M Souq loyalty card. Show your QR code at checkout and earn a reward after six purchases.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
