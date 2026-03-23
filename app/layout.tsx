import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/ui/Header";
import StoreHydration from "@/components/StoreHydration";
import AuthProvider from "@/components/auth/AuthProvider";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FDFAF7",
};

export const metadata: Metadata = {
  title: "SkinBase - Know Your Skin",
  description: "Personalized skincare routines. Ingredient safety scores. AI skin transformation. For every skin type.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light', background: '#FDFAF7' }}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#FDFAF7' }}
      >
        <StoreHydration />
        <AuthProvider>
          <Header />
          <main className="pb-20" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3.5rem)' }}>
            {children}
          </main>
        </AuthProvider>
        <footer style={{ padding: '16px 20px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: '#a8a29e', lineHeight: 1.4, maxWidth: 500, margin: '0 auto' }}>
            SkinBase is not a medical application and does not provide medical advice, diagnosis, or treatment. All recommendations, including AI skin analysis and product suggestions, are for informational and educational purposes only. Always consult a qualified dermatologist or healthcare professional for skin concerns. &quot;Pregnancy Safe&quot; labels are not guarantees — consult your doctor.
          </p>
          <p style={{ fontSize: 9, color: '#a8a29e', marginTop: 4 }}>
            <a href="/privacy/" style={{ textDecoration: 'underline' }}>Privacy Policy</a> · <a href="/terms/" style={{ textDecoration: 'underline' }}>Terms of Service</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
