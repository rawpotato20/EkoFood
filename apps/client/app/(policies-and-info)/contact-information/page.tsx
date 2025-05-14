import Footer from "@/packages/ui/src/components/basic/footer";
import HomeNav from "@/packages/ui/src/components/basic/home-nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Update the toast to Sonner for toast notifications
import toast from "react-hot-toast";

interface SettingsData {
  contact_email: string;
  contact_phone: string;
}

const ContactInformation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState<SettingsData>({
    contact_email: "",
    contact_phone: "",
  });

  const fetchSettings = async () => {
    const res = await fetch("/api/view/settings").then((res) => res.json());
    if (res.success) {
      setSettings(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <>
      <div className="bg-black flex flex-col">
        <HomeNav />

        <div className="flex justify-center items-center mt-20 mb-14 text-white text-2xl md:text-5xl font-bold">
          Kontaktinė Informacija
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-0 mt-10 mb-24 h-96 text-lg">
        Mums yra svarbi jūsų nuomonė, nes ji padeda mūsų svetainei ir verslui
        tobulėti, todėl jeigu turite kokių nors klausimų ar pastabų, su mumis
        galite susisiekti čia:
        <br />
        (Greičiau atsakome, jei susisiekiate paštu)
        <br />
        <br />
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-row space-x-5 w-full">
            <div className="w-1/2 font-medium text-right">El. Paštas:</div>
            <div className="w-1/2 text-left">
              <Link
                className="text-secondary"
                href={`mailto:` + settings.contact_email}
              >
                {settings.contact_email}
              </Link>
            </div>
          </div>
          <div className="flex flex-row space-x-5 w-full">
            <div className="w-1/2 font-medium text-right">Tel. numeris:</div>
            <div className="w-1/2 text-left">
              <Link
                className="text-secondary"
                href={`mailto:` + settings.contact_phone}
              >
                {settings.contact_phone}
              </Link>
            </div>
          </div>
          {/* <div className="flex flex-row space-x-5 w-full">
                        <div className="w-1/2 font-medium text-right">
                            Individualios veiklos pazymejimas priklauso:
                        </div>
                        <div className="w-1/2 text-left">1200897</div>
                    </div>
                    <div className="flex flex-row space-x-5 w-full">
                        <div className="w-1/2 font-medium text-right">
                            Individualios veiklos pažymėjimas priklauso:
                        </div>
                        <div className="w-1/2 text-left">Oskarui Charčiuk</div>
                    </div> */}
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default ContactInformation;
