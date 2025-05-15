import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Update the toast to Sonner for toast notifications
import toast from "react-hot-toast";

import About from "@/packages/ui/src/components/home/about";
import Review from "@/packages/ui/src/components/home/review";
import Footer from "@/packages/ui/src/components/basic/footer";
import RegisterModal from "@/packages/ui/src/components/user/register-modal";
import LoginModal from "@/packages/ui/src/components/user/login-modal";
import * as fbq from "@/packages/utils/src/fpixel";
import Head from "next/head";
import Welcome2 from "@/packages/ui/src/components/home/welcome2";
import { GetServerSidePropsContext } from "next";

interface Ad {
  title: string;
  logo: string;
  image2: string;
  background: string;
  background2: string;
  text: string;
}

interface WelcomeData {
  heading: string;
  text: string;
  heading2: string;
}

const AdPage = ({ ad, welcomeData }: { ad: Ad; welcomeData: WelcomeData }) => {
  const router = useRouter();
  const pathname = usePathname();

  const aboutHeader = ["Kas tai", "Kodėl tau rūpi", "Veikimo principas"];

  const aboutData1 = [
    {
      id: 1,
      name: "Kas tai",
      image: "/about-1-new.png",
      text: `Ar esate pavargę nuo beprasmio laiko švaistymo, ieškant sveiko maisto savo stalui? EkoFood - tai jūsų išsigelbėjimas, sukurta tiems, kurie siekia gyventi sveikai, neaukojant savo brangaus laiko ir energijos. <br /> <br /> Šiuolaikiniame pasaulyje, kai virtuvėse guli traškučiai, o parduotuvių lentynos lūžta nuo perdirbto maisto, pasirinkti tikrą, pilnavertį maistą tapo tikru iššūkiu. Mitybos sprendimai, paremti greitais ir patogiais sprendimais, dažnai veda prie nesveiko gyvenimo būdo. <br /> <br /> <b>EkoFood</b> suteikia galimybę atrasti sveikus produktus, greitai, inovatyviai ir nesukeliant jokių rūpesčių.  <br /> <br /> Leiskite, palengvinti Jums kelionę į sveikesnį gyvenimą, nes mes žinome, kad  sveika mityba gali būti paprasta ir maloni. <br /> <br /> Atraskite EkoFood - jūsų sveikos mitybos partnerį šiandien!`,
      // button_text: "CTA",
      // button_link: "/",
    },
    {
      id: 2,
      name: "Kodėl tau rūpi",
      image: "/about-2.jpg",
      text: `Šiais laikais žmonės dažnai susiduria su sveikatos, odos, imuninėmis problemomis, kurių didžiausia problema yra nesveikas maistas ir vitaminų, bei mineralų trūkumas.<br /> <br />Žmonės pasirenka nesimaitinti sveikai, nes didžioji dalis nežino ko Jiems reikia. O kita dalis susiduria su patogumo klausimu.<br /> <br />Laimė jiems, nes EkoFood išsprendžia šias problemas keliais mygtukų paspaudimais!`,
      // button_text: "CTA",
      // button_link: "/",
    },
  ];

  const aboutData2 = [
    {
      id: 1,
      name: "Veikimo principas",
      image: "/about-3.jpg",
      textTitle1: "Susikuri paskyrą.",
      textDescription1: "",
      textTitle2: "Išsirenki norimus produktus.",
      textDescription2: "",
      textTitle3: "Įsidedi juos į krepšelį.",
      textDescription3: "",
      textTitle4:
        "Produktai bus pristatomi Jūsų pasirinkimu į paštomatą arba tiesiai Jums į namus kas mėnesį!",
      textDescription4: "",
      textTitle5:
        "Jūs galite keisti krepšelyje pasirinktus produktus ir bet kada patvirtinti ar atšaukti jo gavimą.",
      textDescription5: "",
      // button_text: "CTA",
      // button_link: "/",
    },
  ];

  const [reviewData, setReviewData] = useState([]);

  const fetchReviews = async () => {
    const res = await fetch("/api/view/review").then((res) => res.json());
    if (res.success) {
      setReviewData(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  let startTime: number;

  const handleClose = (index: number, value: boolean) => {
    if (index === 1) {
      setShow(value);
    } else {
      setShow2(value);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow(false);
        setShow2(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    fbq.pageview();
  }, []);

  const handleClick = (name: string, value: number) => {
    fbq.event(name, { value: value });
  };

  const customTrack = async (label: string, value: number) => {
    const res = await fetch("/api/view/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link: ad.title,
        label: label,
        value: value,
      }),
    }).then((res) => res.json());
    if (res.success) {
      return;
    } else {
      console.log(res.message);
    }
  };

  // Track "Average Time Spent on Page" event
  useEffect(() => {
    startTime = Date.now();

    const sendTimeSpentEvent = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
      fbq.event("AverageTimeSpent", { time_spent: timeSpent });
    };

    window.addEventListener("beforeunload", sendTimeSpentEvent);

    // Cleanup to avoid memory leaks
    return () => {
      window.removeEventListener("beforeunload", sendTimeSpentEvent);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{ad.title}</title>
      </Head>
      <div
        className="bg-contain bg-top bg-no-repeat w-full md:hidden flex flex-col"
        style={{ backgroundImage: `url(${ad.background})` }}
      >
        <div className="flex justify-center items-center py-4">
          <Image
            src={ad.logo}
            alt={ad.title}
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
        <div className="w-full h-[250px] md:h-[800px]">
          {/* <Image
                        src={ad.image}
                        alt={ad.title}
                        width={1920}
                        height={1000}
                        className="w-full h-[400px] md:h-[1000px]"
                    /> */}
        </div>
        <div className="space-y-5 black-div text-white">
          <div className="pt-2 container mx-auto md:px-0 flex flex-row justify-between items-center">
            <div className="w-full md:w-1/2">
              <h1 className="text-lg md:text-2xl font-bold">{ad.title}</h1>
              <br />
              <p className="text-sm md:text-lg md:w-4/5 whitespace-pre-line">
                {ad.text}
              </p>
            </div>
            <div className="hidden md:flex justify-center w-1/2">
              <Image
                src={ad.image2}
                alt={ad.title}
                width={500}
                height={500}
                className="w-[500px] h-[500px]"
              />
            </div>
          </div>
          <div className="pb-2 container mx-auto px-3 md:px-0 flex justify-center items-center">
            <button
              className="bg-secondary text-white rounded-lg py-2 md:py-4 px-7 md:px-48 text-base md:text-xl"
              onClick={() => {
                setShow(true);
                handleClick("reg_btn_1", 1);
                customTrack("reg_btn_1", 1);
              }}
              data-umami-event="Register button clicked"
            >
              Registruokis!
            </button>
          </div>
        </div>
      </div>
      <div
        className="hidden md:flex bg-cover bg-top bg-no-repeat w-full flex-col"
        style={{ backgroundImage: `url(${ad.background2})` }}
      >
        <div className="flex justify-center items-center py-4">
          <Image
            src={ad.logo}
            alt={ad.title}
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
        <div className="w-full h-[500px] md:h-[800px]">
          {/* <Image
                        src={ad.image}
                        alt={ad.title}
                        width={1920}
                        height={1000}
                        className="w-full h-[400px] md:h-[1000px]"
                    /> */}
        </div>
        <div className="pt-2 pb-10 space-y-5 bg-black/30 text-white">
          <div className="pt-5 container mx-auto px-3 md:px-0 flex flex-row justify-between items-center">
            <div className="w-full md:w-1/2">
              <h1 className="text-2xl font-bold">{ad.title}</h1>
              <br />
              <p className="text-lg md:w-4/5 whitespace-pre-line">{ad.text}</p>
            </div>
            <div className="hidden md:flex justify-center w-1/2">
              <Image
                src={ad.image2}
                alt={ad.title}
                width={500}
                height={500}
                className="w-[500px] h-[500px]"
              />
            </div>
          </div>
          <div className="pb-10 container mx-auto px-3 md:px-0 flex justify-center items-center">
            <button
              className="bg-secondary text-white rounded-lg py-2 md:py-4 px-12 md:px-48 text-lg md:text-xl"
              onClick={() => {
                setShow(true);
                handleClick("reg_btn_1", 1);
                customTrack("reg_btn_1", 1);
              }}
              data-umami-event="Register button clicked"
            >
              Registruokis!
            </button>
          </div>
        </div>
      </div>
      {/* <div className="w-full relative">
                <Image
                    src={ad.image3}
                    alt={ad.title}
                    width={1920}
                    height={240}
                    className="w-full h-[150px] md:h-[240px]"
                />
                <button
                    className="absolute top-[40%] left-[20%] md:left-[35%] mx-auto bg-secondary rounded-lg py-2 md:py-4 px-12 md:px-48 text-black text-lg md:text-xl"
                    onClick={() => {
                        setShow(true)
                        handleClick('reg_btn_1', 1)
                        customTrack("reg_btn_1", 1);
                    }
                    }
                >
                    Registruokis!
                </button>
            </div> */}
      <div className="">
        <Welcome2 data={welcomeData} customTrack={customTrack} />
      </div>
      <div>
        <About
          welcomeData={welcomeData}
          headers={aboutHeader}
          data1={aboutData1}
          data2={aboutData2}
          handleClick={handleClick}
          customTrack={customTrack}
        />
        <br />
        <Review
          data={reviewData}
          handleClick={handleClick}
          customTrack={customTrack}
        />
        <Footer />
      </div>
      {show && (
        <RegisterModal
          handleClose={handleClose}
          handleClick={handleClick}
          customTrack={customTrack}
        />
      )}
      {show2 && <LoginModal handleClose={handleClose} />}
    </>
  );
};

export default AdPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.params || typeof context.params.id !== "string") {
    return { notFound: true };
  }
  const { id } = context.params;

  let ad = {};
  const defaultWelcomeData = {
    heading: "Maistas Jūsų sveikatai.",
    text: `Sveika mityba dabar yra ne tik išmintinga, bet ir stilinga. <br /><br /> Čia rasite kruopščiai atrinktus tik ekologiškus, gamtai draugiškus ir patvirtintus produktus. <br /><br /> Norite pagerinti savo mitybą? Pasirinkite savo mėgstamus produktus ir mėgaukitės jų pristatymu tiesiai pas Jus kiekvieną mėnesį, atsikratydami visų rūpesčių.`,
    // button_text: "Registracija",
    // button_link: "/",
    heading2: "",
  };

  const res = await fetch(`${process.env.WEB_URL}/api/view/ad?id=${id}`).then(
    (res) => res.json()
  );
  const titleRes = await fetch(process.env.WEB_URL + "/api/view/settings").then(
    (titleRes) => titleRes.json()
  );

  const data = titleRes.data;

  const heading2 = data.ads_title || "";

  if (res.success) {
    ad = res.data;
    // console.log(ad);
  } else {
    toast.error(res.message);
    console.log(res.message);
  }
  if (!ad) {
    return { notFound: true };
  } else
    return {
      props: {
        id,
        ad,
        welcomeData: { ...defaultWelcomeData, heading2 },
      },
    };
}
