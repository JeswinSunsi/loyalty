import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M Souq Rewards",
  description: "Preview the M Souq loyalty card and staff checkout experience.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
