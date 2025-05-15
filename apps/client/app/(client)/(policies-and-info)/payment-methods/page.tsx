import Footer from "@/packages/ui/src/components/basic/footer";
import HomeNav from "@/packages/ui/src/components/basic/home-nav";
import { usePathname, useRouter } from "next/navigation";

const PaymentMethods = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="bg-black flex flex-col">
        <HomeNav />

        <div className="flex justify-center items-center mt-20 mb-14 text-white text-2xl md:text-5xl font-bold">
          Mokėjimo Būdai
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-0 mt-10 mb-56 h-96 text-lg">
        Atsiskaityti galima naudojantis Swed, Seb, Luminor, Citadelės, Šiaulių
        banko elektroninės bankininkystės paslaugomis, Visa / MasterCard
        mokėjimo kortelėmis, bei Kniks dovanų kortelėmis. Atsiskaitymai galimi
        euro valiuta. Mokėjimai apdorojami naudojantis MakeCommerce.lt mokėjimų
        platforma.
        <br />
        Elektroninėje parduotuvėje apmokėjimai apdorojami naudojantis
        makecommerce.lt platforma, kurios valdytojas Maksekeskus AS (Liivalaia
        45, Tallinn 10145, Estija, reg. nr.:12268475), todėl Jūsų asmeninė
        informacija, reikalinga mokėjimo įvykdymui ir patvirtinimui, bus
        perduodama Maksekeskus AS.
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default PaymentMethods;
