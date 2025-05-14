import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsBox = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="w-full space-y-7">
                <div>
                    <h1 className="text-xl md:text-2xl font-medium">
                        Jūsų dežė:
                    </h1>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                    <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">Dabartinė dežės kaina:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>
                                {props.data.current_box_price
                                    ? Number(
                                          props.data.current_box_price
                                      ).toFixed(2)
                                    : 0}{" "}
                                €
                            </div>
                        </div>
                    </div>

                    <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">Pristatymas:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>
                                {/* {props.data.current_box_discount
                                    ? Number(
                                          props.data.current_box_discount
                                      ).toFixed(2)
                                    : 0}
                                % */}
                                {props.cart.shipping_fee
                                    ? Number(props.cart.shipping_fee).toFixed(2)
                                    : 0}{" "}
                                €
                            </div>
                        </div>
                    </div>

                    <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
                        <div className="w-1/2">Galutinė suma:</div>
                        <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                            <div>
                                {props.data.current_box_final_price
                                    ? Number(
                                          props.data.current_box_final_price
                                      ).toFixed(2)
                                    : 0}{" "}
                                €
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsBox;
