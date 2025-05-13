import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { lat, long } = req.body;
        try {
            // console.log(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.MAPS_API_KEY}`);
            // const ress = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=post_office&key=${process.env.MAPS_API_KEY}`).then((ress) => ress.json());
            const ress = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.MAPS_API_KEY}`).then((ress) => ress.json());
            // console.log("nearyby ress", ress);
            if (ress.status === "OK") {
                let city = "";
                let zipCode = "";

                // Loop through each result
                ress.results.forEach(result => {
                    result.address_components.forEach(component => {
                        if (component.types.includes("locality")) {
                            city = component.long_name;
                        }
                        if (component.types.includes("postal_code")) {
                            zipCode = component.long_name;
                        }
                    });
                });

                // console.log("city", city);

                const ress2 = await fetch(`https://go.venipak.lt/ws/get_pickup_points?country=LT&city=${city}&pick_up_enabled=true&pick_up_type=1&view=json`).then((ress2) => ress2.json());
                // const ress2 = await fetch(`https://go.venipak.lt/ws/get_pickup_points?country=LT&zip=12142&city=Vilnius&pick_up_enabled=true&pick_up_type=1&view=json`).then((ress2) => ress2.json());
                // `https://maps.google.com/?q=${lat},${lng}`

                // console.log("nearby ress2", ress2);

                const data = {
                    name: ress2[0].display_name,
                    address: ress2[0].address,
                    city: ress2[0].city,
                    zipCode: ress2[0].zip,
                    lat: ress2[0].lat,
                    lng: ress2[0].lng,
                    mapUrl: `https://maps.google.com/?q=${ress2[0].lat},${ress2[0].lng}`,
                    contact: ress2[0].contact_t,
                };

                return res.status(200).json({ success: true, data: data });
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
