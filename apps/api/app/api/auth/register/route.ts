import { generateSubscriptionToken } from "@/lib/subscriptionToken";
import Box from "@/models/Box";
import Cart from "@/models/Cart";
import DeletedUser from "@/models/DeletedUser";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import Stripe from "stripe";
const nodemailer = require("nodemailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, last_name, email, password } = req.body;
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(500)
          .json({ success: false, message: "Ši paskyra jau yra sukurta." });
      }
      const hashedPassword = await hashPassword(password);
      const cart = await Cart.create({});
      if (!cart) {
        return res
          .status(400)
          .json({ success: false, message: "Krepšelis nesukurtas" });
      }

      const box = await Box.create({});
      if (!box) {
        return res
          .status(400)
          .json({ success: false, message: "Dėžutė nesukurta" });
      }

      const user = await User.create({
        name,
        last_name,
        email,
        password: hashedPassword,
        cart_id: cart._id,
        box_id: box._id,
      });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Vartotojas nesukurtas" });
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
          email,
          name,
          status: "enabled",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to connect to Listmonk: ${response.statusText}`);
    }

    const data = await response.json();

    if (data?.data?.id) {
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        connected_with_listmonk: true,
        listmonk_subscriber_id: data?.data?.id,
      });

      console.log("User updated:", updatedUser);
    } else {
      console.log("No ID returned from Listmonk response:", data);
    }
      
      const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: "Sveiki atvykę į EkoFood! 💚",
        html: `
               
                                  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #415946; color: #fff; padding: 20px; text-align: center; display:flex; align-items:center; justify-content:center; gap:20px;">
                    <h1 style="margin: 0; font-size: 24px; text-align:center;">Sveiki atvykę į „EkoFood“ bendruomenę!💚</h1>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px; margin: 0 0 10px;">
                    Esame labai laimingi, kad prisijungėte prie mūsų! „EkoFood“ yra čia, kad suteiktų Jums geriausią patirtį ir produktus, kurie palaiko Jūsų sveikatą.
                    </p>
                    <p style="font-size: 16px; margin: 0 0 10px;">
                    Dabar galite tyrinėti mūsų platų sveikų produktų asortimentą ir mėgautis sveikesniu gyvenimu.
                    </p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                      <div>
                    <p style="margin: 0; text-align: center; font-weight: bold; font-size: 18px;">
                        💡 Prisijunkite prie mūsų  naujienlaiškio ir gaukite 10% nuolaidą pirmajam užsakymui! Nepraleiskite ypatingų pasiūlymų ir naudingų naujienų! 
                  
                    </p> 
                    <a href="${
                      process.env.NEXT_PUBLIC_WEB_URL
                    }/api/subscribe-newsletter/${generateSubscriptionToken(
          user
        )}" style="display: inline-block; padding: 10px 20px; background-color: #415946; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Prenumeruoti</a>
                      </div>
                    
                    </div>
                    <p style="font-size: 16px; margin: 0 0 10px;">
                    Jeigu turite klausimų arba reikia pagalbos, prašome nedvejodami susisiekti su mumis:
                    </p>
                    <div style="font-size: 14px; color: #555;">
                       <img src='${
                         process.env.NEXT_PUBLIC_WEB_URL
                       }/EmailLogo.png' alt='EkoFood Logo' style='width: 160px; margin-right: 10px; height:63px; margin-bottom:10px;' />
                    <p><b>EkoFood - Maistas Jūsų sveikatai</b><p/>
                    Telefono Nr.: +37066726986<br />
                    El. Paštas:  <a href="mailto:info@ekofood.lt" style="color: #415946; text-decoration: none;">info@ekofood.lt</a>
                    </div>
                </div>
                <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #777;">
                    <p style="margin: 0;">© 2025 EkoFood. Visos teisės saugomos.</p>
                </div>
                </div>
                    `,
        text: `Sveiki atvykę į EkoFood! 👋

          Esame labai laimingi, kad prisijungėte prie mūsų bendruomenės. EkoFood yra čia, kad suteiktų Jums geriausią patirtį ir maistą, kuris palaiko Jūsų sveikatą.

          Dabar galite pradėti tyrinėti mūsų produktus ir paslaugas!

          💡 Prisijunkite prie mūsų naujienlaiškio ir gaukite 10% nuolaidą pirmajam užsakymui!
          Nepraleiskite ypatingų pasiūlymų ir naudingų naujienų:
          ${process.env.NEXT_PUBLIC_WEB_URL}/api/subscribe-newsletter/[token]

          Jeigu turite klausimų ar reikia pagalbos:
          EkoFood - Maistas Jūsų sveikatai
          Telefono Nr.: +370 677 66423
          El. Paštas: info@ekofood.lt

          © 2025 EkoFood. Visos teisės saugomos.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error:", error);
          return res.status(500).json({
            success: false,
            message: "Error sending email. Confirm email and try again",
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            success: true,
            message: "Sveikiname! Laiškas išsiųstas sėkmingai.",
          });
        }
      });

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", "Basic " + process.env.STRIPE_API_KEY);

      const urlencoded = new URLSearchParams();
      urlencoded.append("name", name);
      urlencoded.append("email", email);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch("https://api.stripe.com/v1/customers", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          // console.log(result);

          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
              stripe_customer_id: result.id,
            },
            { new: true }
          );
          const u = {
            _id: updatedUser._id,
            name: updatedUser.name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            address: updatedUser.address,
            phone: updatedUser.phone,
            active_delivery: updatedUser.active_delivery,
            payment_card_name: updatedUser.payment_card_name,
            payment_card_number: updatedUser.payment_card_number,
            payment_connected: updatedUser.payment_connected,
            box_id: updatedUser.box_id,
            cart_id: updatedUser.cart_id,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at,
            stripe_customer_id: updatedUser.stripe_customer_id,
          };
          return res.status(200).json({
            success: true,
            message: "Sveiki atvykę!",
            data: u,
          });
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === "GET") {
    return res
      .status(405)
      .json({ success: false, message: "GET method is not allowed" });
  } else if (req.method === "PUT") {
    const { id, key, value } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Vartotojas nerastas",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { [key]: value },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({
          success: false,
          message: "User not updated",
        });
      }
      const u = {
        _id: updatedUser._id,
        name: updatedUser.name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        active_delivery: updatedUser.active_delivery,
        payment_card_name: updatedUser.payment_card_name,
        payment_card_number: updatedUser.payment_card_number,
        payment_connected: updatedUser.payment_connected,
        box_id: updatedUser.box_id,
        cart_id: updatedUser.cart_id,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        stripe_customer_id: updatedUser.stripe_customer_id,
      };
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: u,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Vidinė serverio klaida",
      });
    }
  } else if (req.method === "DELETE") {
    const { password, id } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Vartotojas nerastas",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Password does not match",
        });
      }
      const deleteUser = await DeletedUser.create({
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
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(400).json({
          success: false,
          message: "User not deleted",
        });
      }
      const deleted = await stripe.customers.del(user.stripe_customer_id);
      // console.log(deleted);
      if (!deleted.deleted) {
        return res.status(400).json({
          success: false,
          message: "Stripe customer not deleted",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Vidinė serverio klaida",
      });
    }
  } else {
    return res.status(200).json({
      success: true,
      message:
        "Hello there, how are you? Since you are here now, maybe reach out to sc0rp10n-py on github or sc0rp10n_py on twitter",
    });
  }
};

export default dbConnect(handler);
