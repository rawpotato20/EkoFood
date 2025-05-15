import Footer from "@/packages/ui/src/components/basic/footer";
import HomeNav from "@/packages/ui/src/components/basic/home-nav";
import React from "react";

import ReactHtmlParser from "html-react-parser";

interface SettingsData {
  about_page_content: string;
}

const AboutUs = ({ data }: { data: SettingsData }) => {
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

export async function getServerSideProps() {
  let data;
  const res = await fetch(process.env.WEB_URL + "/api/view/settings").then(
    (res) => res.json()
  );
  if (res.success) {
    data = res.data;
  } else {
    console.log(res.message);
  }
  return {
    props: { data },
  };
}
