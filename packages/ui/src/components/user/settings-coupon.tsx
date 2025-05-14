import { formatDate } from "@/lib/date";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGift } from "react-icons/fa";
import {
  RiCoupon3Line,
  RiCalendarLine,
  RiGiftLine,
  RiTimeLine,
} from "react-icons/ri";

const SettingsCoupon = (props) => {
  const router = useRouter();
    const pathname = usePathname();
    const [coupons, setCoupons] = useState([]);
    const fetchCoupons = async () => {
        const res = await fetch(`/api/view/coupons/${props.data._id}`).then((res) => res.json());
        if (res.success) {
            setCoupons(res.data);
        }
    };

    useEffect(() => {
        if (props.data._id) fetchCoupons();
    }, [props.data._id]);


  return (
    <>
      <div className="w-full space-y-7">
        <div>
          <h1 className="text-xl md:text-2xl font-medium">Jūsų kuponai:</h1>
        </div>
        {coupons.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {[coupons].length > 0 ? (
              <div className="min-w-full grid grid-cols-1 md:grid-cols- gap-4">
                {coupons.map((data) => (
                  <div
                    key={data._id}
                    className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100"
                  >
                    <div className="w-full flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                            <RiCoupon3Line className="w-4 h-4 inline-block mr-1" />
                            {data.coupon.percentage}%
                          </span>
                          <span className="text-gray-500 text-sm">
                            <RiTimeLine className="w-4 h-4 inline-block mr-1" />
                            {formatDate(data.expires)}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mt-2">
                          {data.coupon.name}
                        </h2>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <RiCoupon3Line className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <RiCalendarLine className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span>Suteikta: {formatDate(data.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
                <div className="bg-gray-100 p-6 rounded-full">
                  <RiGiftLine className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-500">
                  Kuponų nerasta
                </h2>
                <p className="text-gray-400 text-center max-w-md">
                  Jūs šiuo metu neturite aktyvių kuponų. Sekite naujienas, kad
                  nepraleistumėte specialių pasiūlymų!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <FaGift className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-500">
              Kuponų nerasta
            </h2>
            <p className="text-gray-400 text-center max-w-md">
              Jūs šiuo metu neturite aktyvių kuponų. Sekite naujienas, kad
              nepraleistumėte specialių pasiūlymų!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsCoupon;
