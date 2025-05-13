import { usePathname, useRouter } from "next/navigation";
import { RiArrowLeftLine, RiSettings4Line } from "react-icons/ri";

const ProductNav = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="container mx-auto flex flex-row justify-between items-center text-black my-4">
                <div>
                    <button
                        className="flex justify-center items-center"
                        onClick={() => router.back()}
                    >
                        <RiArrowLeftLine className="text-3xl md:text-4xl text-primary font-bold" />
                    </button>
                </div>
                <div className="">
                    <button
                        className="flex justify-center"
                        onClick={() => router.push("/settings")}
                        data-umami-event="Settings Button Clicked"
                    >
                        <RiSettings4Line className="text-3xl text-primary font-bold" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductNav;
