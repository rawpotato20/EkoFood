import Verify from "@/models/Verify";
import dbConnect from "@/utils/dbConnect";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    },
});

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { email } = req.body;
        try {
            const generatedOTP = Math.floor(100000 + Math.random() * 900000);
            const verify = await Verify.create({
                email,
                otp: generatedOTP,
            });

            const mailOptions = {
                from: process.env.MAIL,
                to: email,
                subject: "Sveiki💚, Jūsų patvirtinimo kodas: " + generatedOTP,
                html: `
                <div style='font-family: Arial, sans-serif;'>
  <p><b>Čia EkoFood</b>, 👋</p>
  <p>Matome, kad norite patvirtinti jūsų el. paštą, taigi paimkite šį specialiai jums skirtą kodą ir įklijuokite jį į tam skirtą langelį:</p>
  <h2>${generatedOTP}</h2>
  <p>Ačiū Jums,</p>
  <div style='display: flex; align-items: center;'>
    <img src='https://ekofood.lt/email-logo.jpg' alt='EkoFood Logo' style='width: 50px; margin-right: 10px;' />
    <div>
      <b>EkoFood - Maistas Jūsų sveikatai.</b><br/>
      Telefono Nr.: +37066726986<br/>
      El. Paštas: <a href='mailto:info@ekofood.lt'>info@ekofood.lt</a>
    </div>
  </div>
</div>
`,
                text: `Čia EkoFood, 👋\nMatome, kad norite patvirtinti jūsų el. paštą, taigi paimkite šį specialiai jums skirtą kodą ir įklijuokite jį į tam skirtą langelį:\n\n${generatedOTP}\n\nAčiū Jums,\nEkoFood - Maistas Jūsų sveikatai.\nTelefono Nr.: +37066726986\nEl. Paštas: info@ekofood.lt`
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
                        message: "Laiškas išsiųstas sėkmingai.",
                        otp: generatedOTP,
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
        }
    } else if (req.method === "GET") {
        return res
            .status(405)
            .json({ success: false, message: "GET method is not allowed" });
    } else if (req.method === "PUT") {
        const { email, otp } = req.body;
        try {
            const verify = await Verify.findOne({ email, otp });
            if (!verify) {
                return res.status(404).json({
                    success: false,
                    message: "Email and OTP do not match",
                });
            }
            const deleteVerify = await Verify.findByIdAndDelete(verify._id);
            return res.status(200).json({
                success: true,
                message: "Paštas patvirtintas.",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Vidinė serverio klaida",
            });
        }
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
