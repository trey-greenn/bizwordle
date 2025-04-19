import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V3P05B96VJ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-V3P05B96VJ');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
