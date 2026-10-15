import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = {
  title: {
    default: "Köprüaltı Tattoo & Piercing",
    template: "%s | Köprüaltı Tattoo & Piercing",
  },
  description: "Köprüaltı Tattoo & Piercing, İzmir Alsancak ve Karşıyaka.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Rye&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
