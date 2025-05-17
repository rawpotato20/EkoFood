import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AboutSection from "./about-section";
import AboutTab from "./about-tab";

interface WelcomeData {
  heading2: string;
}

interface AboutSectionData {
  image: string;
  text: string;
}

interface AboutTabData {
  image: string;
  textTitle1: string;
  textDescription1: string;
  textTitle2: string;
  textDescription2: string;
  textTitle3: string;
  textDescription3: string;
  textTitle4: string;
  textDescription4: string;
}

interface AboutProps {
  welcomeData: WelcomeData;
  headers: string[];
  data1: AboutSectionData[]; // expected 2 items (for active === 0 and 1)
  data2: AboutTabData[]; // expected 1 item (for active === 2)
  handleClick: (id: string, step: number) => void;
  customTrack: (id: string, step: number) => void;
}

const About = (props: AboutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState(0);

  return (
    <>
      <div className="container mx-auto px-3 md:px-0 py-14 md:py-24 space-y-10 lg:pt-32 xl:pt-60">
        <div
          className="text-xl md:text-4xl font-bold text-center"
          data-aos="fade-down"
        >
          {props.welcomeData.heading2}
        </div>
        <div>
          <div className="flex flex-row justify-between md:justify-around">
            {props.headers.map((header, index) => (
              <button
                key={index}
                onClick={() => {
                  setActive(index);
                  props.handleClick(header, 1);
                  props.customTrack(header, 1);
                }}
                className={`text-xs md:text-sm py-1 md:py-2 px-4 md:px-6 text-black rounded-full border-2 border-primary ${
                  active === index ? "bg-primary text-white" : "bg-white"
                }`}
                data-umami-event={`Clicked on About Tab ${header}`}
              >
                {header}
              </button>
            ))}
          </div>
          <div>
            {active === 0 && props.data1[0] && (
              <AboutSection
                data={props.data1[0]}
                handleClick={props.handleClick}
                customTrack={props.customTrack}
              />
            )}
            {active === 1 && props.data1[1] && (
              <AboutSection
                data={props.data1[1]}
                handleClick={props.handleClick}
                customTrack={props.customTrack}
              />
            )}
            {active === 2 && props.data2[0] && (
              <AboutTab
                data={props.data2[0]}
                handleClick={props.handleClick}
                customTrack={props.customTrack}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
