import { Geologica, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
    default: "Easy Building & Construction Pty Ltd | Melbourne Builder",
    template: "%s | Easy Building & Construction",
  },
  description: "Melbourne residential builder for new homes, renovations and extensions. Register your project for a free consultation with a registered, insured builder.",
  openGraph: {
    siteName: "Easy Building & Construction Pty Ltd",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
        {children}
      </body>
    </html>
  );
}
