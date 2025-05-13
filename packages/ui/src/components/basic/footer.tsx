import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const Footer = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
      <>
        <div className="hidden md:flex border-t-2 border-primary">
          <div className="container mx-auto flex flex-row items-center space-x-4 pt-14 pb-5 text-sm">
            <div>&copy; 2025, EkoFood. Visos teisės saugomos.</div>
            <div className="font-black text-lg">·</div>
            {/* <div>
                        <Link href="/payment-methods">Mokėjimo Būdai</Link>
                    </div> */}
            {/* <div className="font-black text-lg">·</div> */}
            <div>
              <Link href="/website-usage-policy">
                Tinklapio Naudojimo Taisyklės
              </Link>
            </div>
            <div className="font-black text-lg">·</div>
            <div>
              <Link href="/contact-information">Kontaktinė Informacija</Link>
            </div>
            <div className="font-black text-lg">·</div>
            <div>
              <Link href="/privacy-policy">Privatumo Politika</Link>
            </div>
            <div className="font-black text-lg">·</div>
            <div>
              <Link href="/about-us">Apie mus</Link>
            </div>
          </div>
        </div>
       

        <div className="flex md:hidden border-t-2 border-primary">
          <div className="container mx-auto px-3 md:px-0 flex flex-col items-center space-y-4 pt-14 pb-5 text-xs">
            <div>&copy; 2025, EkoFood. Visos teisės saugomos.</div>
            <div className="w-1/2 mx-auto">
              <hr className="border-primary h-5 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 w-11/12">
              {/* <div>
                            <Link href="/payment-methods">Mokėjimo Būdai</Link>
                        </div> */}
              <div>
                <Link href="/website-usage-policy">
                  Tinklapio Naudojimo Taisyklės
                </Link>
              </div>
              <div>
                <Link href="/contact-information">Kontaktinė Informacija</Link>
              </div>
              <div>
                <Link href="/privacy-policy">Privatumo Politika</Link>
              </div>
              <div>
                <Link href="/about-us">Apie mus</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  flex flex-col  items-center justify-center mx-auto">
          
          <div className="w-full relative h-10 flex justify-center mt-2 bg-[#415946]">
            <Image
              src="/auth/cards.png"
              fill
              alt="cards"
              className="object-contain left-0 "
            />
          </div>
        </div>
      </>
    );
};

export default Footer;
