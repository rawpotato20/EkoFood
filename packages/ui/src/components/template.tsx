import { usePathname, useRouter } from "next/navigation";

const Template = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="container mx-auto"></div>
    </>
  );
};

export default Template;
