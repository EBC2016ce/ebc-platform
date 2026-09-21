import { Geologica, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Analytics from "./components/Analytics";
import JsonLd from "./components/JsonLd";
import { siteGraph } from "@/lib/site";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL("https://easybcon.com.au"),
  title: {
    default: "Melbourne Home Builder | Renovations, Extensions & New Homes | EBC",
    template: "%s | Easy Building & Construction",
  },
  description: "Registered Melbourne builder for home renovations, extensions and new homes in the Eastern Suburbs. Free consultation - register online or call 1300 715 840.",
  applicationName: "Easy Building & Construction",
  openGraph: {
    siteName: "Easy Building & Construction Pty Ltd",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/hero-melbourne-home-build.jpg", width: 1200, height: 630, alt: "Modern home built by Easy Building & Construction in Melbourne" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/hero-melbourne-home-build.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body className={`${geologica.variable} ${hankenGrotesk.variable} antialiased`}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1065732779519840');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1065732779519840&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <JsonLd data={siteGraph()} />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
