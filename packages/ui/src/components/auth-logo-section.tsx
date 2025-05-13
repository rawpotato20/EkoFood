import Image from "next/image";
import React from "react";

const logos = [
  { size: "55%", path: "/auth/ssl.png", alt: "SSL Secured" },
  {
    size: "33%",
    path: "/auth/satisfaction guaranteed.png",
    alt: "Satisfaction Guaranteed",
  },
  {
    size: "30%",
    path: "/auth/organic certified.png",
    alt: "Organic Certified",
  },
];

const AuthLogoSection = () => {
  return (
    <div className="w-full flex justify-center pt-3">
      <div className="flex gap-1  ">
        {logos.map((logo, index) => (
          <div
            key={`${logo.path}-${index}`}
            className="relative flex justify-center items-center"
            style={{
              width: logo.size,
              height: "auto",
            }}
          >
            <Image
              src={logo.path}
              alt={logo.alt}
              layout="responsive"
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthLogoSection;
