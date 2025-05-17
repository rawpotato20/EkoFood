import { usePathname, useRouter } from "next/navigation";

//TODO: Lucid Icons and Nookies
import { RiArrowLeftLine, RiSettings4Line } from "react-icons/ri";
import { IoExitOutline } from "react-icons/io5";
import { destroyCookie } from "nookies";

interface DashboardNavProps {
  user?: {
    name?: string;
  };
  customTrack: (eventName: string, value: number) => void;
}

const DashboardNav = (props: DashboardNavProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="container mx-auto flex flex-row justify-between items-center text-black my-5">
        <div className="flex flex-row items-center">
          <div>
            <button
              className="flex justify-center items-center mr-2"
              onClick={() => router.push("/")}
              data-umami-event="Back To Home Button Clicked"
            >
              <RiArrowLeftLine className="text-3xl md:text-4xl text-primary font-bold" />
            </button>
          </div>
          <div className="text-2xl font-medium">
            Sveiki,{" "}
            <span className="text-2xl text-primary font-medium">
              {props.user?.name}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div>
            <button
              className="flex justify-center mr-2"
              onClick={() => {
                props.customTrack("settings_viewed", 1);
                router.push("/settings");
              }}
              data-umami-event="Settings Button Clicked"
            >
              <RiSettings4Line className="text-3xl text-primary font-bold" />
            </button>
          </div>
          <div>
            <button
              className="flex justify-center"
              onClick={() => {
                destroyCookie(null, "user");
                destroyCookie(null, "showModal");
                router.push("/");
              }}
              data-umami-event="Exit Button Clicked"
            >
              <IoExitOutline className="text-3xl text-danger" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
