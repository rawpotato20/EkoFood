import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../basic/quill-editor"), {
    ssr: false,
});

const SettingsForm = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [certificate, setCertificate] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [aboutEcoDiscountText, setAboutEcoDiscountText] = useState("");
        const [aboutPageContent, setAboutPageContent] = useState("");

    // const [discount, setDiscount] = useState("");
    const [warningText, setWarningText] = useState("");
    const [loginText, setLoginText] = useState("");
    const [shippingBracket, setShippingBracket] = useState("");
  const [shippingFees, setShippingFees] = useState({});
  const [adsTitle, setAdsTitle] = useState("");

    const [mail1, setMail1] = useState("");
    const [mail2, setMail2] = useState("");
    const [mail3, setMail3] = useState("");
    const [mail4, setMail4] = useState("");
    const [courier1, setCourier1] = useState("");
    const [courier2, setCourier2] = useState("");
    const [courier3, setCourier3] = useState("");
    const [courier4, setCourier4] = useState("");

    const [loading, setLoading] = useState(false);

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    const fetchSettings = async () => {
        const res = await fetch("/api/view/settings").then((res) => res.json());
        if (res.success) {
            setCertificate(res.data.certificate);
            setContactEmail(res.data.contact_email);
            setContactPhone(res.data.contact_phone);
            setAboutEcoDiscountText(res.data.about_eco_discount_text);
            setAboutPageContent(res.data.about_page_content);
            // setDiscount(res.data.discount);
            setWarningText(res.data.warning_text);
            setLoginText(res.data.login_text);
            setShippingBracket(res.data.shipping_bracket);
            setShippingFees(res.data.shipping_fees);
            setMail1(res.data.shipping_fees.omniva.mail);
            setMail2(res.data.shipping_fees.dpd.mail);
            setMail3(res.data.shipping_fees.lp.mail);
            setMail4(res.data.shipping_fees.venipak.mail);
            setCourier1(res.data.shipping_fees.omniva.courier);
            setCourier2(res.data.shipping_fees.dpd.courier);
            setCourier3(res.data.shipping_fees.lp.courier);
          setCourier4(res.data.shipping_fees.venipak.courier);
          setAdsTitle(res.data.ads_title);
        } else {
            toast.error(res.message);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let shipping = {
            omniva: {
                mail: mail1,
                courier: courier1,
            },
            dpd: {
                mail: mail2,
                courier: courier2,
            },
            lp: {
                mail: mail3,
                courier: courier3,
            },
            venipak: {
                mail: mail4,
                courier: courier4,
            },
        };
        const res = await fetch("/api/admin/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": adminPassword,
            },
            body: JSON.stringify({
                certificate,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                about_eco_discount_text: aboutEcoDiscountText,
                about_page_content: aboutPageContent,
                // discount,
                warning_text: warningText,
                login_text: loginText,
                shipping_bracket: shippingBracket,
              shipping_fees: shipping,
              ads_title: adsTitle,
            }),
        }).then((res) => res.json());
        if (res.success) {
            toast.success(res.message);
            setLoading(false);
            fetchSettings();
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    const handleTextChange1 = (i) => {
        setAboutEcoDiscountText(i);
    };
    const handleAboutPageChange = (i) => {
        setAboutPageContent(i);
    };  

    const handleTextChange2 = (i) => {
        setLoginText(i);
    };

    return (
      <>
        <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label>Certificate No</label>
              <input
                type="text"
                value={certificate}
                onChange={(e) => setCertificate(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>About Eco Discount Text</label>
              {/* <textarea
                            value={aboutEcoDiscountText}
                            onChange={(e) =>
                                setAboutEcoDiscountText(e.target.value)
                            }
                            className="rounded-md py-2 px-4"
                            required
                        /> */}
              <Editor
                value={aboutEcoDiscountText}
                setValue={handleTextChange1}
              />
            </div>
            <div className="flex flex-col">
              <label>About Page Content</label>
              {/* <textarea
                            value={aboutEcoDiscountText}
                            onChange={(e) =>
                                setAboutEcoDiscountText(e.target.value)
                            }
                            className="rounded-md py-2 px-4"
                            required
                        /> */}
              <Editor
                value={aboutPageContent}
                setValue={handleAboutPageChange}
              />
            </div>
            {/* <div className="flex flex-col">
                        <label>Discount</label>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="rounded-md py-2 px-4"
                            required
                        />
                    </div> */}
            <div className="flex flex-col">
              <label>Warning Text</label>
              <textarea
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Login Text</label>
              {/* <textarea
                            value={loginText}
                            onChange={(e) => setLoginText(e.target.value)}
                            className="rounded-md py-2 px-4"
                            required
                        /> */}
              <Editor value={loginText} setValue={handleTextChange2} />
            </div>
            <div className="flex flex-col">
              <label>Shipping Bracket</label>
              <input
                type="text"
                value={shippingBracket}
                onChange={(e) => setShippingBracket(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg">Siuntimas:</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm">Omniva Mail</label>
                  <input
                    type="text"
                    value={mail1}
                    onChange={(e) => setMail1(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Omniva Courier</label>
                  <input
                    type="text"
                    value={courier1}
                    onChange={(e) => setCourier1(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">DPD Mail</label>
                  <input
                    type="text"
                    value={mail2}
                    onChange={(e) => setMail2(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">DPD Courier</label>
                  <input
                    type="text"
                    value={courier2}
                    onChange={(e) => setCourier2(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">LP Mail</label>
                  <input
                    type="text"
                    value={mail3}
                    onChange={(e) => setMail3(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">LP Courier</label>
                  <input
                    type="text"
                    value={courier3}
                    onChange={(e) => setCourier3(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Venipak Mail</label>
                  <input
                    type="text"
                    value={mail4}
                    onChange={(e) => setMail4(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Venipak Courier</label>
                  <input
                    type="text"
                    value={courier4}
                    onChange={(e) => setCourier4(e.target.value)}
                    className="rounded-md py-2 px-4"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label>Ads Title</label>
              <textarea
                value={adsTitle}
                onChange={(e) => setAdsTitle(e.target.value)}
                className="rounded-md py-2 px-4"
                required
              />
             
            </div>
            <button
              type="submit"
              className="bg-primary text-white rounded-md py-2 px-4 md:px-7"
            >
              {loading ? "Įkeliama..." : "Save"}
            </button>
          </form>
        </div>
      </>
    );
};

export default SettingsForm;
