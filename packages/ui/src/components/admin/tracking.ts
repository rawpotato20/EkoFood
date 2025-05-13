import { useState, useEffect } from "react";

const Tracking = () => {
    const [home, setHome] = useState({});
    const [ad1, setAd1] = useState({});
    const [ad2, setAd2] = useState({});
    const [ad3, setAd3] = useState({});

    const [time, setTime] = useState("12 hours");

    const getData = async (link, time) => {
        const res = await fetch(
            "api/view/track?link=" + link + "&time=" + time
        ).then((res) => res.json());
        if (res.success) {
            if (link == "home") {
                setHome(res.data);
            } else if (link == "gauk") {
                setAd1(res.data);
            } else if (link == "prisijunk") {
                setAd2(res.data);
            } else if (link == "registruokis") {
                setAd3(res.data);
            }
        } else {
            console.log(res.message);
        }
    };

    useEffect(() => {
        getData("home", time);
        getData("gauk", time);
        getData("prisijunk", time);
        getData("registruokis", time);
    }, [time]);

    const options = [
        "7 days",
        "3 days",
        "1 days",
        "12 hours",
        "6 hours",
        "3 hours",
        "1 hours",
        "30 minutes",
        "15 minutes",
    ];

    return (
        <>
            <div className="container mx-auto p-5 space-y-5">
                <div>
                    <label>Select Time Frame</label>
                    <select
                        className="border border-blue-600 py-2 px-4 rounded-lg"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="border p-5 rounded-md">
                    <h1 className="font-medium">Home Page</h1>
                    {Object.entries(home).map(([key, value]) => (
                        <div key={key}>
                            {key} = {value}
                        </div>
                    ))}
                </div>

                <div className="border p-5 rounded-md">
                    <h1 className="font-medium">Gauk Page</h1>
                    {Object.entries(ad1).map(([key, value]) => (
                        <div key={key}>
                            {key} = {value}
                        </div>
                    ))}
                </div>

                <div className="border p-5 rounded-md">
                    <h1 className="font-medium">Prisijunk Page</h1>
                    {Object.entries(ad2).map(([key, value]) => (
                        <div key={key}>
                            {key} = {value}
                        </div>
                    ))}
                </div>

                <div className="border p-5 rounded-md">
                    <h1 className="font-medium">Registruokis Page</h1>
                    {Object.entries(ad3).map(([key, value]) => (
                        <div key={key}>
                            {key} = {value}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Tracking;
