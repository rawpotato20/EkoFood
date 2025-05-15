import Footer from "@/packages/ui/src/components/basic/footer";
import About from "@/packages/ui/src/components/home/about";
import Review from "@/packages/ui/src/components/home/review";
import Welcome from "@/packages/ui/src/components/home/welcome";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as fbq from "@/packages/utils/src/fpixel";
import Head from "next/head";

//TODO: Replace with Sonner
import toast from "react-hot-toast";

const defaultWelcomeData = {
  heading: "Maistas Jūsų sveikatai.",
  text: `Sveika mityba dabar yra ne tik išmintinga, bet ir stilinga. <br /><br /> Čia rasite kruopščiai atrinktus tik ekologiškus, gamtai draugiškus ir patvirtintus produktus. <br /><br /> Norite pagerinti savo mitybą? Pasirinkite savo mėgstamus produktus ir mėgaukitės jų pristatymu tiesiai pas Jus kiekvieną mėnesį, atsikratydami visų rūpesčių.`,
  // button_text: "Registracija",
  // button_link: "/",
  heading2: "",
};

interface WelcomeData {
  heading: string;
  text: string;
  heading2: string;
}

export async function getServerSideProps() {
  const res = await fetch(process.env.WEB_URL + "/api/view/settings").then(
    (res) => res.json()
  );

  const data = res.data;

  const heading2 = data.ads_title || "";

  return {
    props: {
      welcomeData: { ...defaultWelcomeData, heading2 },
    },
  };
}

const Home = ({ welcomeData }: { welcomeData: WelcomeData }) => {
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
      textTitle1: "Išsirinkite norimus produktus.",
      textDescription1: "Pridėkite juos į savo dėžę.",
      textTitle2: "Aktyvuokite pristatymą.",
      textDescription2:
        "Paspauskite raudoną mygtuką ir suveskite mokėjimo bei pristatymo duomenis.",
      textTitle3: "Automatinis pristatymas kas mėnesį.",
      textDescription3:
        "Aktyvavus krepšelį, produktai Jums bus pristatomi kiekvieną mėnesį. <b><i><u>Svarbu:</u></i></b> Užsakymas, kurį aktyvuosite dabar, bus pristatytas ne šį, o kitą mėnesį.",
      textTitle4: "Mokėsite tik po pristatymo.",
      textDescription4: "Mokėjimas bus įvykdytas tik gavus produktus.",
      // textTitle5: "Jūs galite keisti krepšelyje pasirinktus produktus ir bet kada patvirtinti ar atšaukti jo gavimą.",
      // textDescription5: "",
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

  // useEffect(() => {
  //     let user = parseCookies().user;
  //     if (user) {
  //         router.push("/dashboard");
  //     }
  // }, []);

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
        link: "home",
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

  return (
    <>
      <Head>
        <title>Maistas Jūsų sveikatai!</title>
      </Head>
      <div className="bg-christmas">
        <div className="">
          <Welcome data={welcomeData} customTrack={customTrack} />
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
      </div>
    </>
  );
};

export default Home;
