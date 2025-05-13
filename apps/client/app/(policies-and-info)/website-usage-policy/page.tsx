import Footer from "@/components/basic/footer";
import HomeNav from "@/components/basic/home-nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WebsiteUsagePolicy = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="bg-black flex flex-col">
                <HomeNav />

                <div className="flex justify-center items-center mt-20 mb-14 text-white text-2xl md:text-5xl font-bold">
                    Tinklapio Naudojimo Taisyklės
                </div>
            </div>

            <div className="container mx-auto px-3 md:px-0 mt-10 mb-56 h-96 text-base">
                <b>Pristatymo politika</b>
                <br />
                Dėžė yra pristatoma kiekvieno mėnesio paskutinę savaitę, tą
                pačią savaitę yra automatiškai nuoskaičiuojami pinigai už jūsų
                dėžę (iki kol nesustabdysite automatinio mokėjimo). Pristatome
                visoje Lietuvoje per paštomatus.
                <br />
                Informacija apie paštomatų pasirinkimą ir pristatymo įkainius
                yra išdėstyta pradėjus mokėjimo procesą ir priėjus prie
                pristatymo skilties.
                <br />
                <br />
                <b>Grąžinimo politika</b>
                <br />
                Kadangi priekiaujame maistu, t.y., prekėmis kurios turi
                galiojimo datą, dėžė ir visas jos turinys nėra grąžinami.
                <br />
                <br />
                {/* <b>Pirkimo procesas</b>
                <br />
                Svetainės veikimo principas ir pirkimo procesas yra rodomi čia:
                [LINK TO VIDEO] */}
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default WebsiteUsagePolicy;
