import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXN0b21lcl9pZCI6MTE3MDA5LCJhZG1pbl9pZCI6bnVsbCwic2lnbmF0dXJlX2lkIjoiMjI5YWU0YzYtM2MzMC00MTc5LWE5ZWItYmM1Nzk4MzRhNTUyIiwic2lnbmF0dXJlX25hbWUiOiJ3ZWJzaXRlIiwiaXNzIjoiYW1iZXItbHQiLCJleHAiOjEwMTczMTY5OTMzNn0.yl0PakmZ4UtFsOxxjW7DcDvWUGqI3ebKPD-buZtvFMU");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            await fetch("https://esiunta.dpd.lt/api/v1/lockers?countryCode=LT", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    return res.status(200).json({ success: true, data: result });
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ success: false, message: error.message });
                });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    } else if (req.method === "PUT") {
        return res
            .status(405)
            .json({ success: false, message: "PUT method is not allowed" });
    } else if (req.method === "DELETE") {
        return res
            .status(405)
            .json({ success: false, message: "DELETE method is not allowed" });
    } else {
        return res
            .status(200)
            .json({
                success: true,
                message:
                    "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
            });
    }
};

export default dbConnect(handler);
