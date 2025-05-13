import Footer from "@/components/basic/footer";
import HomeNav from "@/components/basic/home-nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PrivacyPolicy = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="bg-black flex flex-col">
                <HomeNav />

                <div className="flex justify-center items-center mt-20 mb-14 text-white text-2xl md:text-5xl font-bold">
                    Privatumo Politika
                </div>
            </div>

            <div className="container mx-auto px-3 md:px-0 mt-10 mb-24">
                <ol className="list-decimal text-base">
                    <li>
                        PAGRINDINĖS SĄVOKOS
                        <ol className="ml-4 list-disc text-base">
                            <li>
                                Bendrovė arba Asmens duomenų valdytojas -
                                Fizinis asmuo, pagal Lietuvos Respublikos
                                įstatymus vygdantis individualią veiklą.
                            </li>
                            <li>
                                Klientas arba Duomenų subjektas - fizinis asmuo
                                - Bendrovės klientas (tame tarpe tinklapio
                                lankytojai), kurio asmens duomenis renka
                                Bendrovė.
                            </li>
                            <li>
                                Elektroninė parduotuvė - Bendrovės elektroninė
                                parduotuvė adresu ekofood.lt.
                            </li>
                            <li>
                                Paslaugos - visos Bendrovės teikiamos paslaugos.
                            </li>
                            <li>
                                Asmens duomenys - bet kuri informacija, susijusi
                                su fiziniu asmeniu - Duomenų subjektu, kurio
                                tapatybė yra žinoma arba gali būti tiesiogiai ar
                                netiesiogiai nustatyta pasinaudojant tokiais
                                duomenimis kaip asmens kodas, vienas arba keli
                                asmeniui būdingi fizinio, fiziologinio,
                                psichologinio, ekonominio, kultūrinio ar
                                socialinio pobūdžio požymiai.
                            </li>
                            <li>
                                Asmens duomenų tvarkymas - bet kuris su asmens
                                duomenimis atliekamas veiksmas: rinkimas,
                                užrašymas, kaupimas, saugojimas, klasifikavimas,
                                grupavimas, jungimas, keitimas (papildymas ar
                                taisymas), teikimas, paskelbimas, naudojimas,
                                loginės ir (arba) aritmetinės operacijos,
                                paieška, skleidimas, naikinimas ar kitoks
                                veiksmas arba veiksmų rinkinys.
                            </li>
                            <li>
                                Partneris - juridinis asmuo, teikiantis
                                paslaugas Bendrovei, susijusias su Bendrovės
                                vykdoma veikla, arba parduodantis jai prekes,
                                arba vykdantis su Bendrove bendrus projektus,
                                įskaitant, bet neapsiribojant, rinkodaros
                                akcijas, bendras pardavimų kampanijas, lojalumo
                                programas, ir kt., žiniasklaidos priemonėse,
                                internetiniuose puslapiuose, Elektroninėje
                                parduotuvėje, mažmeninės prekybos parduotuvėse,
                                prekybos tinkluose, ir kt.
                            </li>
                            <li>
                                Slapukas (angl. cookie) - nedidelė tekstinės
                                informacijos dalelė, kuri automatiškai sukuriama
                                naršant tinklapyje ir yra saugoma lankytojo
                                kompiuteryje ar kitame įrenginyje.
                            </li>
                            <li>
                                Tiesioginė rinkodara - veikla, skirta paštu,
                                telefonu arba kitokiu tiesioginiu būdu siūlyti
                                asmenims prekes ar paslaugas ir (arba) teirautis
                                jų nuomonės dėl siūlomų prekių ar paslaugų.
                            </li>
                            <li>
                                Privatumo politika - reiškia šį dokumentą,
                                nustatantį Asmens duomenų tvarkymo principus bei
                                taisykles, naudojantis Elektroninės parduotuvės
                                paslaugomis.
                            </li>
                            <li>
                                Paskyra - pagrindiniai Kliento prisijungimo prie
                                Elektroninės parduotuvės duomenys, kuriuos
                                sudaro vienas elektroninio pašto adresas ir
                                Slaptažodis.
                            </li>
                            <li>
                                Slaptažodis - tai Kliento sukurta unikali
                                skaičių, raidžių, arba skaičių ir raidžių arba
                                kitų simbolių kombinacija, kurią suvedus galima
                                prisijungti prie Elektroninės parduotuvės.
                            </li>
                        </ol>
                    </li>
                    <li>
                        BENDROSIOS NUOSTATOS
                        <ol className="ml-4 list-disc text-base">
                            <li>
                                Klientas suteikia teisę Bendrovei atlikti visus
                                Asmens duomenų tvarkymo veiksmus šioje Privatumo
                                politikoje numatyta apimtimi ir tikslais.
                            </li>
                            <li>
                                Asmens duomenis tvarkomi vadovaujantis Lietuvos
                                Respublikos Asmens duomenų teisinės apsaugos
                                įstatymu bei kitais Asmens duomenų tvarkymą bei
                                apsaugą reglamentuojančiais teisės aktais, šia
                                Privatumo politika.
                            </li>
                            <li>
                                Bendrovėje Asmens duomenys tvarkomi
                                vadovaujantis šiais žemiau nurodytais
                                principais:
                                <ol className="ml-7 list-decimal text-base">
                                    <li>
                                        Asmens duomenys renkami apibrėžtais ir
                                        teisėtais tikslais;
                                    </li>
                                    <li>
                                        Asmens duomenys tvarkomi tiksliai,
                                        sąžiningai ir teisėtai;
                                    </li>
                                    <li>
                                        Asmens duomenys yra tinkami ir tik
                                        tokios apimties, kuri būtina jiems
                                        rinkti ir toliau tvarkyti;
                                    </li>
                                    <li>Asmens duomenys nuolat atnaujinami;</li>
                                    <li>
                                        Asmens duomenys saugomi tokia forma, kad
                                        Duomenų subjekto tapatybę būtų galima
                                        nustatyti ne ilgiau, negu to reikia
                                        tiems tikslams, dėl kurių šie duomenys
                                        buvo surinkti ir tvarkomi.
                                    </li>
                                    <li>
                                        Visa informacija apie Asmens duomenis
                                        yra konfidenciali;
                                    </li>
                                    <li>
                                        Kliento Asmens duomenys bei asmeninė
                                        informacija nebus naudojama neteisėtais
                                        tikslais.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                Laikoma, kad Klientas, pirkdamas Elektroninėje
                                parduotuvėje perskaitė galiojančios redakcijos
                                Privatumo politiką ir su ja sutinka. Jei
                                Klientas nesutinka su kuria nors Privatumo
                                politikos dalimi ar Privatumo politika, tokiu
                                atveju Klientas privalo nepateikti užsakymo ir
                                nepirkti prekės Elektroninėje parduotuvėje.
                            </li>
                            <li>
                                Su Privatumo politika galima susipažinti
                                Elektroninėje parduotuvėje ir bet kada ją
                                atsispausdinti. Privatumo politika gali būti
                                keičiama, pildoma ar atnaujinama Bendrovės
                                nuožiūra. Nauja Privatumo politikos redakcija
                                skelbiama Elektroninėje parduotuvėje.
                            </li>
                            <li>
                                Klientas gali pateikti užsakymą Elektroninėje
                                parduotuvėje be registracijos, arba per savo
                                Paskyrą prisiregistravus Elektroninėje
                                parduotuvėje.
                            </li>
                            <li>
                                Pirminės registracijos prie Elektroninės
                                parduotuvės metu per Paskyrą, Klientas privalo
                                pateikti savo elektroninio pašto adresą bei
                                sugalvoti saugų Slaptažodį, bei pateikti
                                tikslius Asmens duomenis Elektroninei
                                parduotuvei. Klientas atsako už jų teisingumą.
                                Sukūrus Paskyrą, Klientui suteikiamas
                                identifikavimo kodas.
                            </li>
                            <li>
                                Naudodamasis Paslaugomis, taip pat pirkdamas
                                Elektroninėje parduotuvėje Klientas visuomet
                                privalo pateikti tikslius Asmens duomenis
                                Elektroninei parduotuvei ir atsako už jų
                                teisingumą.
                            </li>
                            <li>
                                Klientas turi teisę bet kada keisti bei
                                papildyti Asmens duomenis Paskyroje arba
                                kreiptis į elektroninę parduotuvę su prašymu
                                panaikinti Paskyrą.
                            </li>
                            <li>
                                Klientas privalo neatskleisti Slaptažodžio
                                tretiesiems asmenims ir jį saugoti, priešingu
                                atveju visa su tuo susijusi atsakomybė tenka
                                Klientui.{" "}
                            </li>
                        </ol>
                    </li>
                    <li>
                        ASMENS DUOMENŲ RINKIMAS, NAUDOJIMAS, KOREGAVIMAS IR
                        SAUGOJIMAS
                        <ol className="ml-4 list-disc text-base">
                            <li>
                                Bendrovė gerbia kiekvieno Kliento teisę į
                                privatumą. Kliento Asmens duomenys (t.y. vardas,
                                pavardė, elektroninio pašto adresas, telefono
                                numeris, prekės/paslaugos pristatymo adresas,
                                amžius/gimimo metai, prekės/paslaugos apmokėjimo
                                duomenys (banko sąskaitos Nr., apmokėjimo būdas
                                ir pan.), pirkimo istorija, o taip pat, esant
                                Kliento sutikimui, amžius, lytis, gimimo data,
                                gyvenamoji vietovė) renkami ir tvarkomi šiais
                                tikslais:
                                <ol className="ml-7 list-decimal text-base">
                                    <li>
                                        Elektroninės prekybos tikslu. Tvarkomi
                                        šie Asmens duomenys: vardas, pavardė,
                                        elektroninio pašto adresas, telefono
                                        numeris, prekės/paslaugos pristatymo
                                        adresas, amžius/gimimo metai, IP
                                        adresas, prekės/paslaugos apmokėjimo
                                        duomenys. Asmens duomenų, naudojamų
                                        elektroninės prekybos tikslu, saugojimo
                                        trukmė yra 5 (penki) metai nuo
                                        paskutinio prisijungimo prie
                                        Elektroninės parduotuvės dienos.
                                    </li>
                                    <li>
                                        Tiesioginės rinkodaros tikslu. Tvarkomi
                                        šie Asmens duomenys: vardas, pavardė,
                                        telefono numeris, elektroninio pašto
                                        adresas, adresas, amžius, lytis, gimimo
                                        data, gyvenamoji vietovė. Asmens
                                        duomenų, naudojamų Tiesioginės
                                        rinkodaros tikslu, saugojimo trukmė yra
                                        5 (penki) metai nuo paskutinio
                                        prisijungimo prie Elektroninės
                                        parduotuvės dienos.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                Klientas gali suteikti sutikimą dėl jo Asmens
                                duomenų (vardo, pavardės telefono numerio,
                                elektroninio pašto adreso, adreso, amžius,
                                lyties, gimimo datos, gyvenamosios vietovės)
                                tvarkymo Tiesioginės rinkodaros tikslu. Jeigu
                                davęs sutikimą tvarkyti jo duomenis Tiesioginės
                                rinkodaros tikslu, taip pat gauti Tiesioginės
                                rinkodaros pranešimus, Klientas vėliau to
                                nebepageidaus ir informuos apie tai Bendrovę,
                                Bendrovė nebetvarkys jo Asmens duomenų
                                Tiesioginės rinkodaros tikslu ir nesiųs Klientui
                                jokių elektroninių naujienų, išskyrus su Kliento
                                užsakymu susijusią informaciją.
                            </li>
                            <li>
                                Klientas bet kada turi teisę atšaukti 3.2 punkte
                                esantį savo sutikimą Bendrovei tvarkyti Kliento
                                Asmens duomenis Tiesioginės rinkodaros tikslu,
                                pateikdamas apie tai atitinkamą pranešimą
                                Bendrovei elektroniniu paštu info@ekofood.lt ir
                                aiškiai nurodydamas, kad atšaukia savo sutikimą
                                naudoti jo Asmens duomenis Tiesioginės
                                rinkodaros tikslu bei nepageidauja gauti jokių
                                Tiesioginės rinkodaros pranešimų.
                            </li>
                            <li>
                                Klientas taip pat turi galimybę atsisakyti
                                įgyvendinti savo teisę nesutikti, kad Kliento
                                Asmens duomenys būtų tvarkomis Tiesioginės
                                rinkodaros tikslu paspaudus atitinkamą nuorodą,
                                esančią kiekviename siunčiamame elektroniniame
                                laiške.
                            </li>
                            <li>
                                Klientas, kaip Duomenų subjektas, turi šias
                                žemiau išvardytas teises, susijusias su Kliento
                                Asmens duomenų tvarkymo procedūromis:
                                <ol className="ml-7 list-decimal text-base">
                                    <li>
                                        gauti iš Bendrovės informaciją apie
                                        Kliento Asmens duomenų tvarkymą,
                                        susipažinti su savo Asmens duomenimis ir
                                        kaip jie yra tvarkomi;
                                    </li>
                                    <li>
                                        gauti iš Bendrovės informaciją, iš kokių
                                        šaltinių ir kokie Kliento asmens
                                        duomenys surinkti, kokiu tikslu jie
                                        tvarkomi, kokiems duomenų gavėjams
                                        teikiami ir buvo teikti bent per
                                        paskutinius 1 (vienerius) metus;
                                    </li>
                                    <li>
                                        reikalauti ištaisyti, sunaikinti Kliento
                                        Asmens duomenis arba sustabdyti,
                                        išskyrus saugojimą, savo Asmens duomenų
                                        tvarkymo veiksmus, kai Asmens duomenys
                                        tvarkomi nesilaikant Lietuvos
                                        Respublikos Asmens duomenų teisinės
                                        apsaugos įstatymo ir kitų įstatymų
                                        nuostatų.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                Realizuodamas savo teises, Klientas turi
                                pateikti pasą, asmens tapatybės kortelę arba
                                vairuotojo pažymėjimą. Bendrovė neatlygintinai
                                teikia Duomenų subjektui informaciją apie
                                tvarkomus Duomenų subjekto Asmens duomenis kartą
                                per metus. Klientas, realizuoti savo teises,
                                numatytas 3.5 punkte, gali kreipiantis
                                elektroniniu paštu info@ekofood.lt. Bendrovė
                                turi teisę koreguoti, keisti, naikinti Asmens
                                duomenis arba stabdyti Asmens duomenų tvarkymą
                                tik identifikavus Kliento, kuris kreipėsi,
                                tapatybę.{" "}
                            </li>
                            <li>
                                Kliento Asmens duomenys yra neteikiami
                                tretiesiems asmenims, išskyrus šiuos atvejus:
                                <ol className="ml-7 list-decimal text-base">
                                    <li>
                                        Kuomet yra gautas Kliento sutikimas,
                                        kaip nurodyta šioje Privatumo
                                        politikoje;
                                    </li>
                                    <li>
                                        Asmens duomenys elektroninės prekybos
                                        tikslais teikiami Partneriams,
                                        teikiantiems Bendrovei paslaugas,
                                        susijusias su Bendrovės vykdoma veikla;
                                    </li>
                                    <li>
                                        Lietuvos Respublikos įstatymų ir teisės
                                        aktų numatytais atvejais kompetentingoms
                                        institucijoms.
                                    </li>
                                    {/* <li>
                                        Elektroninėje parduotuvėje apmokėjimai
                                        apdorojami naudojantis makecommerce.lt
                                        platforma, kurios valdytojas Maksekeskus
                                        AS (Liivalaia 45, Tallinn 10145, Estija,
                                        reg. nr.:12268475), todėl Jūsų asmeninė
                                        informacija, reikalinga mokėjimo
                                        įvykdymui ir patvirtinimui, bus
                                        perduodama Maksekeskus AS.{" "}
                                    </li> */}
                                </ol>
                            </li>
                            <li>
                                Klientui yra žinoma apie jo teisę nesutikti, kad
                                būtų tvarkomi jo Asmens duomenys Tiesioginės
                                rinkodaros tikslu, t.y. Klientas turi teisę
                                išreikšti nesutikimą iš karto, arba vėliau.
                            </li>
                            <li>
                                Klientas sutinka, kad jo Asmens duomenys būtų
                                perduodami Partneriams vykdant Kliento užsakymą,
                                pateiktą Elektroninėje parduotuvėje, taip pat
                                Bendrovei teikiant Paslaugas Klientui, taip pat
                                Bendrovės Partneriams, kaip nurodyta 3.7.
                                punkte.
                            </li>
                            <li>
                                Jei Klientas nesutinka su Privatumo politika,
                                Klientas neturės galimybės naudotis Elektroninės
                                parduotuvės paslaugomis.
                            </li>
                            <li>
                                Bendrovė, įgyvendina organizacines ir technines
                                priemones, skirtas apsaugoti Asmens duomenis nuo
                                atsitiktinio ar neteisėto sunaikinimo,
                                pakeitimo, atskleidimo, taip pat nuo bet kokio
                                kito neteisėto tvarkymo.
                            </li>
                            <li>
                                Klientas sutinka, kad tais atvejais, kai tai
                                būtina pagal kompetentingų institucijų nurodymus
                                ir/ar Kliento Asmens duomenys buvo galimai
                                panaudoti vykdant neteisėtą veiklą, arba yra
                                pagrįstų įtarimų dėl asmens tapatybės vagystės,
                                dėl kurių kompetentingos teisėsaugos
                                institucijos atlieka ikiteisminį tyrimą, arba
                                yra kiti teisėti pagrindai ar tikslai, jo Asmens
                                duomenys būtų saugomi Bendrovės serveriuose
                                ilgiau, nei nustatyta šioje Privatumo
                                politikoje.
                            </li>
                            <li>
                                Gavusi Duomenų subjekto nurodymą ar paklausimą,
                                susijusį su Asmens duomenų tvarkymu, Bendrovė
                                pateikia Klientui atsakymą, patenkinant
                                prašymą/nurodymą arba motyvuotai atsisakant tai
                                padaryti, ne vėliau kaip per 30 (trisdešimt)
                                kalendorinių dienų nuo Duomenų subjekto
                                kreipimosi datos. Jeigu Duomenų subjektas
                                pageidauja, atsakymas turi būti pateiktas raštu.
                            </li>
                            <li>
                                Tam, kad Elektroninėje parduotuvėje Bendrovė
                                galėtų pasiūlyti Klientui visavertes paslaugas,
                                Kliento sutikimu Kliento kompiuteryje
                                (įrenginyje) įrašoma informacija Slapukai (angl.
                                cookies), kuri naudojama Kliento, kaip
                                ankstesnio Elektroninės parduotuvės naudotojo,
                                atpažinimui, renkant Elektroninės parduotuvės
                                lankomumo statistiką, informaciją apie pirkinių
                                krepšelį. Klientas bet kada gali peržiūrėti,
                                kokie Slapukai yra įrašomi, ir gali ištrinti
                                dalį ar visus įrašytus Slapukus.
                            </li>
                            <li>
                                Norėdami daugiau sužinoti apie slapukus,
                                pavyzdžiui, kaip juos valdyti ar ištrinti,
                                galite apsilankyti www.allaboutcookies.org.{" "}
                            </li>
                        </ol>
                    </li>

                    <li>
                        KITOS NUOSTATOS
                        <ol className="ml-4 list-disc text-base">
                            <li>
                                Bendrovė turi teisę keisti, papildyti „Privatumo
                                politiką“ visiškai ar iš dalies. Privatumo
                                politikos papildymai ar pakeitimai įsigalioja
                                nuo jų paskelbimo dienos.
                            </li>
                            <li>
                                Iškilus klausimams kreipkitės šiais kontaktais: {" "}
                                <Link href="/contact-information" className="text-secondary">
                                    KONTAKTINĖ INFORMACIJA
                                </Link>
                            </li>
                        </ol>
                    </li>
                </ol>
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default PrivacyPolicy;
