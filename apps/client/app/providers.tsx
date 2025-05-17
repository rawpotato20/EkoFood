// app/providers.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

//TODO: Toast and Nookies
import { parseCookies } from "nookies";
import { Toaster } from "react-hot-toast";
// @ts-ignore
import Aos from "aos";
import "aos/dist/aos.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    Aos.init();

    const user = JSON.parse(parseCookies().user || "null");

    if (!user && process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true") {
      if (window.umami) {
        window.umami?.identify?.({ id: user?._id, email: user?.email });
      }
    }
  }, []);

  return (
    <>
      <Toaster position="top-left" reverseOrder={false} />
      <main className="flex-grow">{children}</main>
    </>
  );
}
