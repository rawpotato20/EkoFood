import 'styles/global.css'
import './globals.css'

// import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import Aos from "aos";
import "aos/dist/aos.css";
import * as fbq from "@/lib/fpixel";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { parseCookies } from "nookies";


export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    if (typeof window !== "undefined") {
        Aos.init();
    }

    const router = useRouter();
        useEffect(() => {
            let user = JSON.parse(parseCookies().user || null);
            if (!user) {
                if (process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true") {
                  if (window.umami) {
                    umami.identify({ id: user?._id, email: user?.email });
                  }
                }
                }
        }, []);

    return (
      <>
        <Toaster position="top-left" reverseOrder={false} />
        {/* <ThemeProvider attribute="class"> */}
        {/* <div className="flex flex-col min-h-screen bg-[#191434]"> */}
        <div>
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          {/* <Footer className="mt-auto" /> */}
        </div>
        {/* </ThemeProvider> */}
        {process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true" && (
          <script
            async
            defer
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            src="/umami.js"
          ></script>
        )}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '475202132122033');
          fbq('track', 'PageView');
        `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=475202132122033&ev=PageView&noscript=1`}
          />
        </noscript>
        <noscript>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            <div>
              <p>
                JavaScript is disabled in your browser. Please enable JavaScript
                to use this website.
              </p>
            </div>
          </div>
        </noscript>
      </>
    );
}

import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '475202132122033');
          fbq('track', 'PageView');
        `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=475202132122033&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
