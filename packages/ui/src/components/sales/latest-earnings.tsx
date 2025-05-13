import { useEffect, useState } from "react";

const LatestEarnings = (props) => {
    const [earnings, setEarnings] = useState([]);

    useEffect(() => {
        fetch("/api/order/latest-earnings")
            .then((res) => res.json())
            .then((data) => {
                setEarnings(data.data);
            });
    }, []);

    return (
        <>
            <div className="container mx-auto space-y-2">
                {earnings.map((earning, index) => (
                    <div key={index} className="flex flex-row justify-between">
                        <p>{earning.date}</p>
                        <p>{earning.totalAmount} €</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default LatestEarnings;
