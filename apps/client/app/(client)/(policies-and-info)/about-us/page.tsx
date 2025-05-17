import Footer from "@/packages/ui/src/components/basic/footer";
import HomeNav from "@/packages/ui/src/components/basic/home-nav";
import React from "react";

import ReactHtmlParser from "html-react-parser";

interface SettingsData {
  about_page_content: string;
}

async function getPageData(): Promise<{
  data: { about_page_content: string };
}> {
  const res = await fetch(`${process.env.WEB_URL}/api/view/settings`, {
    cache: "no-store",
  });
  const json = await res.json();

  if (json.success) {
    return { data: json.data };
  } else {
    console.log(json.message);
    return {
      data: {
        about_page_content: "<p>Informacija šiuo metu nepasiekiama.</p>",
      },
    };
  }
}

const AboutUs = async () => {
  const { data } = await getPageData();

  return (
    <>
      <div className="bg-black flex flex-col">
        <HomeNav />

        <div className="flex justify-center items-center mt-20 mb-14 text-white text-2xl md:text-5xl font-bold">
          Apie mus
        </div>
      </div>
      <div className="px-3 w-full flex items-center justify-center">
        <div className="my-14">{ReactHtmlParser(data.about_page_content)}</div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
