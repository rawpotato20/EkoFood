import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Change to lucid icons
import { FiEdit2, FiTrash } from "react-icons/fi";
//TODO: Toast to Sonner
import toast from "react-hot-toast";

import { IoCloseCircleOutline } from "react-icons/io5";
import AddAds from "./add-ads";
import DeleteAds from "./delete-ads";
import EditAds from "./edit-ads";

interface Ad {
  _id: string;
  title: string;
  image: string;
  text: string;
  link: string;
  color: string;
  logoURL: string;
  imageURL: string;
  imageURL2: string;
  imageURL3: string;
  background: string;
  background2: string;
  image2: string;
  logo: string;
}

const Ads = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [ads, setAds] = useState([]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedData, setSelectedData] = useState<Ad | null>(null);

  const fetchAds = async () => {
    const res = await fetch("/api/view/ads").then((res) => res.json());
    if (res.success) {
      setAds(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleClose = () => {
    setOpen3(false);
  };

  return (
    <>
      <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5 h-[80vh]">
        <div className="flex flex-row justify-between">
          <button
            className="bg-primary text-white rounded-xl py-2 px-7"
            onClick={() => setOpen(true)}
          >
            Add
          </button>
        </div>
        <div className="">
          <div className="flex flex-row justify-between bg-black/70 text-white rounded-xl py-2 px-7">
            <div className="w-1/6 text-left">Heading</div>
            <div className="w-1/6 text-left">Image</div>
            <div className="w-1/6 text-left">Link</div>
            <div className="w-1/6 text-right">Actions</div>
          </div>
          <div className="h-[60vh] overflow-y-scroll">
            {ads.map((ad: Ad) => (
              <div
                key={ad.title}
                className="flex flex-row justify-between items-center py-2 px-7 border border-white rounded-xl"
              >
                <div className="w-1/6 text-left flex justify-start">
                  {ad.title}
                </div>
                <div className="w-1/6 text-left flex justify-start">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-contain"
                  />
                </div>
                <div className="w-1/6 text-left flex justify-start">
                  {ad.link}
                </div>
                <div className="w-1/6 text-right flex justify-end space-x-2">
                  <button
                    className="bg-secondary text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen2(true);
                      setSelectedData(ad);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="bg-danger text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen3(true);
                      setSelectedData(ad);
                    }}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {open && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              <AddAds />
            </div>
          </div>
        </>
      )}
      {open2 && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen2(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              {selectedData && <EditAds data={selectedData} />}
            </div>
          </div>
        </>
      )}
      {open3 && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen3(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              {selectedData && (
                <DeleteAds data={selectedData} handleClose={handleClose} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Ads;
