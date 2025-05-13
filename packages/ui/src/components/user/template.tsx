import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Template = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="container mx-auto">
            </div>
        </>
    );
};

export default Template;
