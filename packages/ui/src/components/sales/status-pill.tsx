const StatusPill = (props) => {
    if (props.status === "pending") {
        return (
            <>
                <div className="md:w-1/3 mx-auto rounded-full px-2 py-1 text-xs bg-yellow-500 text-white">
                    {props.status}
                </div>
            </>
        );
    } else if (props.status === "shipped") {
        return (
            <>
                <div className="md:w-1/3 mx-auto rounded-full px-2 py-1 text-xs bg-indigo-500 text-white">
                    {props.status}
                </div>
            </>
        );
    } else if (props.status === "delivered") {
        return (
            <>
                <div className="md:w-1/3 mx-auto rounded-full px-2 py-1 text-xs bg-green-600 text-white">
                    {props.status}
                </div>
            </>
        );
    } else if (props.status === "cancelled") {
        return (
            <>
                <div className="md:w-1/3 mx-auto rounded-full px-2 py-1 text-xs bg-red-500 text-white">
                    {props.status}
                </div>
            </>
        );
    }
    return (
        <>
            <div className="md:w-1/3 mx-auto rounded-full px-2 py-1">
                {props.status}
            </div>
        </>
    );
};

export default StatusPill;
