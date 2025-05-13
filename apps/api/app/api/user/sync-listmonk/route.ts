import Setting from "@/models/Setting";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

const handler = async (req, res) => {
  const adminPassword = req.headers.authorization
    ? req.headers.authorization
    : "";
     

  if (req.method === "POST") {
    const admin = await Setting.findOne();
  if (admin.password === adminPassword) {
      try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
       
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LISTMONK_BASE_URL}/subscribers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${process.env.NEXT_PUBLIC_LISTMONK_API_KEY}`,
            },
            body: JSON.stringify({
              email : user.email,
              name: user.name,
              status: "enabled",
            }),
          }
        );
        

        

        if (!response.ok) {
          const data = await response.json()
          throw new Error(
            `Failed to connect to Listmonk: ${data.message}`
          );
        }

        const data = await response.json();

        if (data?.data?.id) {
          const updatedUser = await User.findByIdAndUpdate(user._id, {
            connected_with_listmonk: true,
            listmonk_subscriber_id: data?.data?.id
          });

        } else {
          console.log("No ID returned from Listmonk response:", data);
        }
        return res
          .status(200)
          .json({ success: true, message: "User connected with Listmonk" });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      } } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }
    } else {
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
    }
 
};

export default dbConnect(handler);
