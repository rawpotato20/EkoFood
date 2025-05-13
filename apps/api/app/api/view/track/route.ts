import Tracking from "@/models/Tracking";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { link, label, value } = req.body;
        try {
            const track = await Tracking.create({
                link,
                label,
                value,
                time: new Date().toISOString(),
            });
            if (!track) {
                return res.status(400).json({ success: false, message: "tracking failure" });
            }
            return res.status(201).json({ success: true, data: track });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    } else if (req.method === "GET") {
        const { link, time } = req.query;
        try {
            if (!time) {
                return res.status(400).json({ success: false, message: "Time parameter is required." });
            }

            // Parse the time parameter
            const [value, unit] = time.split(" ");
            const duration = parseInt(value, 10);

            if (isNaN(duration) || !["minutes", "hours", "days"].includes(unit)) {
                return res.status(400).json({ success: false, message: "Invalid time format." });
            }

            // Calculate the start time for the query
            const now = new Date();
            let startTime;

            switch (unit) {
                case "minutes":
                    startTime = new Date(now.getTime() - duration * 60 * 1000); // subtract minutes
                    break;
                case "hours":
                    startTime = new Date(now.getTime() - duration * 60 * 60 * 1000); // subtract hours
                    break;
                case "days":
                    startTime = new Date(now.getTime() - duration * 24 * 60 * 60 * 1000); // subtract days
                    break;
                default:
                    return res.status(400).json({ success: false, message: "Invalid time unit." });
            }

            // console.log(startTime);

            // Query the database
            const track = await Tracking.find({
                link,
                time: { $gte: startTime.toISOString() }
            });

            if (!track) {
                return res.status(404).json({ success: false, message: "No tracking data found." });
            }

            // console.log("track ", track);

            const data = {};

            // Iterate over the fetched tracking data
            for (let i = 0; i < track.length; i++) {
                const entry = track[i];

                if (!data[entry['label']]) {
                    data[entry['label']] = 0
                }
                
                data[entry['label']] += Number(entry['value'])
            }

            // console.log("data ", data);

            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
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
        return res.status(200).json({
            success: true,
            message:
                "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
        });
    }
};

export default dbConnect(handler);
