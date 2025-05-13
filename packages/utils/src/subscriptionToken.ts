import crypto from "crypto";

export function generateSubscriptionToken(user) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(user._id.toString());
  const signature = hmac.digest("hex");
  return `${user._id}.${signature}`;
}
