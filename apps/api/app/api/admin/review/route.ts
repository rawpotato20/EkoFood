import Review from "@/models/Review";
import Setting from "@/models/Setting";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
    const adminPassword = req.headers.authorization ? req.headers.authorization : "";
    try {
        const admin = await Setting.findOne();
        if (admin.password === adminPassword) {
            if (req.method === "POST") {
                const { name, rating, comment } = req.body;
                try {
                    if (!name || !rating || !comment) {
                        return res.status(400).json({
                            success: false,
                            message: "Please fill all the fields",
                        });
                    }
        
                    const review = await Review.create({
                        name,
                        rating,
                        comment,
                    });
                    if (!review) {
                        return res
                            .status(400)
                            .json({ success: false, message: "Something went wrong" });
                    }
                    return res.status(200).json({ success: true, data: review, message: "Review added" });
                } catch (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .json({ success: false, message: "Vidinė serverio klaida" });
                }
            } else if (req.method === "GET") {
                return res
                    .status(405)
                    .json({ success: false, message: "GET method is not allowed" });
            } else if (req.method === "PUT") {
                const { id, name, rating, comment } = req.body;
                try {
                    if (!id || !name || !rating || !comment) {
                        return res.status(400).json({
                            success: false,
                            message: "Please fill all the fields",
                        });
                    }
        
                    let review = await Review.findById(id);
                    if (!review) {
                        return res
                            .status(404)
                            .json({ success: false, message: "Review not found" });
                    }
        
                    review = await Review.findByIdAndUpdate(
                        id,
                        { name, rating, comment },
                        {
                            new: true,
                        }
                    );
                    if (!review) {
                        return res
                            .status(400)
                            .json({ success: false, message: "Something went wrong" });
                    }
                    return res.status(200).json({ success: true, data: review, message: "Review updated" });
                } catch (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .json({ success: false, message: "Vidinė serverio klaida" });
                }
            } else if (req.method === "DELETE") {
                const { id } = req.body;
                try {
                    if (!id) {
                        return res
                            .status(400)
                            .json({ success: false, message: "Please provide an id" });
                    }
        
                    let review = await Review.findById(id);
                    if (!review) {
                        return res
                            .status(404)
                            .json({ success: false, message: "Review not found" });
                    }
        
                    await Review.deleteOne({ _id: id });
                    return res
                        .status(200)
                        .json({ success: true, message: "Review deleted" });
                } catch (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .json({ success: false, message: "Vidinė serverio klaida" });
                }
            } else {
                return res.status(200).json({
                    success: true,
                    message:
                        "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
                });
            }
        }
        return res
            .status(400)
            .json({ success: false, message: "Not Authorized" });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .success({ success: false, message: error.message });
    }
};

export default dbConnect(handler);
