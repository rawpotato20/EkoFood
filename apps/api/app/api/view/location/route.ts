import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { lat, long } = req.body;
        try {
            const ress = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.MAPS_API_KEY}`).then((ress) => ress.json());
            // console.log(ress);
            if (ress.status === "OK") {
                return res.status(200).json({ success: true, data: ress.results[0].formatted_address });
            } else {
                return res.status(400).json({ success: false, message: "Failed to fetch location" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    } else if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
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
