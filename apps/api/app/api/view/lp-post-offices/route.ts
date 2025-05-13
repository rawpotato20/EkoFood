import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    if (req.method === "POST") {
        return res
            .status(405)
            .json({ success: false, message: "POST method is not allowed" });
    } else if (req.method === "GET") {
        try {
            const myHeaders = new Headers();
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow"
            };
            await fetch("https://api-manosiuntos.post.lt/oauth/token?scope=read&grant_type=password&clientSystem=PUBLIC&username=info@ekofood.lt&password=Cemakin2OP", requestOptions)
                .then((response) => response.json())
                .then(async (result) => {

                    const myHeaders2 = new Headers();
                    myHeaders2.append("Authorization", "Bearer "+result.access_token);
                    const requestOptions2 = {
                        method: "GET",
                        headers: myHeaders2,
                        redirect: "follow"
                    };
                    await fetch("https://api-manosiuntos.post.lt/api/v2/terminal?receiverCountryCode=LT", requestOptions2)
                        .then((response2) => response2.json())
                        .then((result2) => {
                            // console.log(result2);
                            return res.status(200).json({ success: true, data: result2 });
                        })
                        .catch((error) => {
                            console.error(error);
                            return res.status(500).json({ success: false, message: error.message });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ success: false, message: error.message });
                });

            // const ress = await fetch(
            //     "https://go.venipak.lt/ws/get_pickup_points?country=LT&pick_up_enabled=true&pick_up_type=1&view=json"
            // )
            //     .then((ress) => ress.json())
            //     .then((ress) => {
            //         // console.log(res);
            //         return res.status(200).json({ success: true, data: ress });
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //         return res.status(500).json({ success: false, message: error.message });
            //     });
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
