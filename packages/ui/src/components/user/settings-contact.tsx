import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsContact = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="w-full space-y-7">
                <div>
                    <h1 className="text-xl md:text-2xl font-medium">
                        Kontaktai:
                    </h1>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                    {/* <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">Individualios veiklos nr.:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>{props.data.certificate}</div>
                        </div>
                    </div> */}

                    <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">El. paštas:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>
                                <Link
                                    href={`mailto:` + props.data.contact_email}
                                >
                                    {props.data.contact_email}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">Telefono numeris:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>
                                <Link href={`tel:` + props.data.contact_phone}>
                                    {props.data.contact_phone}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsContact;
