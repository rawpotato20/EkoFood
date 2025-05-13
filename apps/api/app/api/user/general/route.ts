import DeletedUser from "@/models/DeletedUser";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Vartotojas nerastas",
        });
      }

      const deletedUserExist = await DeletedUser.findOne({ email: user.email });

      if (!deletedUserExist) {
        await DeletedUser.create({
          id: user._id,
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
          payment: user.payment,
          address: user.address,
          phone: user.phone,
          active_delivery: user.active_delivery,
          payment_card_name: user.payment_card_name,
          payment_card_number: user.payment_card_number,
          payment_connected: user.payment_connected,
          box_id: user.box_id,
          cart_id: user.cart_id,
          stripe_customer_id: user.stripe_customer_id,
          orders: user.orders,
        });
      }

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(400).json({
          success: false,
          message: "User not deleted",
        });
      }

      if (user.stripe_customer_id) {
        try {
          const deleted = await stripe.customers.del(user.stripe_customer_id);
          if (!deleted.deleted) {
            console.warn(
              `Stripe customer ${user.stripe_customer_id} could not be deleted`
            );
          }
        } catch (stripeError) {
          console.warn(
            `Failed to delete Stripe customer ${user.stripe_customer_id}:`,
            stripeError.message
          );
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LISTMONK_BASE_URL}/subscribers/${user.listmonk_subscriber_id}`,
        {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.NEXT_PUBLIC_LISTMONK_API_KEY}`,
          }
        }
      );

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Vidinė serverio klaida",
      });
    }
  }
};

export default dbConnect(handler);
