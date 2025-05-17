import { usePathname, useRouter } from "next/navigation";

//TOOD: Lucid Icons
import { RiArrowLeftLine } from "react-icons/ri";

const AllNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="container mx-auto flex flex-row justify-between items-center text-black my-5">
        <div>
          <button
            className="flex justify-center items-center"
            onClick={() => router.back()}
            data-umami-event="Nav Bar Back Button Clicked"
          >
            <RiArrowLeftLine className="text-3xl md:text-4xl text-primary font-bold" />
          </button>
        </div>
        <div className="text-xl font-medium text-primary ">
          Prekių katalogas:
        </div>
      </div>
    </>
  );
};

export default AllNav;
