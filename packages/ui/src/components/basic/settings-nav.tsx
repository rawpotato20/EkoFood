import { usePathname, useRouter } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";

const SettingsNav = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="container mx-auto flex flex-row justify-between items-center text-black my-5">
                <div>
                    <button className="flex justify-center items-center"
                        onClick={() => router.back()}
                    data-umami-event="Settings Back Button Clicked">
                        <RiArrowLeftLine className="text-3xl md:text-4xl text-primary font-bold"/>
                    </button>
                </div>
                <div className="text-xl md:text-2xl">Nustatymai</div>
            </div>
        </>
    );
};

export default SettingsNav;
