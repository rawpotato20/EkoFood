import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

//TODO: Nookies
import { destroyCookie } from "nookies";

const ModNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="container mx-auto flex flex-row justify-between items-center text-black my-5">
        <div>
          <Link href="/mod" className="text-xl font-bold">
            Mod Dash
          </Link>
        </div>
        <div className="space-x-10 flex flex-row items-center">
          <Link href="/sales">Sales</Link>
          <Link href="/mod">Admin</Link>
          <button
            className="bg-danger text-white rounded-xl py-2 px-7"
            onClick={() => {
              destroyCookie(null, "admin");
              destroyCookie(null, "adminPassword");
              router.push("/mod/login");
            }}
            data-umami-event="Exit Button Clicked"
          >
            Exit
          </button>
        </div>
      </div>
    </>
  );
};

export default ModNav;
