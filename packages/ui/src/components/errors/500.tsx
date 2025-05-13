import Image from "next/image";

export default function Custom500() {
    return (
      <section className="h-screen flex justify-center items-center w-full relative overflow-hidden">
        <div className="w-3/4 h-full absolute -rotate-12 -right-20 md:-right-48">
          <Image
            fill
            alt="background"
            src="/backapple.png"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="relative size-52 md:size-[18.4rem] w-fit-content">
            <Image
              fill
              alt="server image"
              src="/server.png"
              className="object-cover"
            />
          </div>
          <h3 className="text-sm md:text-3xl text-center">
            {`Vidinė serverio klaida :( `} <br />
            <span>Atsiprašome už nepatogumus...</span>
          </h3>
        </div>
      </section>
    );
}
