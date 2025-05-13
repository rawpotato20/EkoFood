export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const TOKEN = process.env.NEXT_PUBLIC_TOKEN;

export const pageview = () => {
  window.fbq("track", "PageView");
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  window.fbq("trackCustom", name, options);
};

export const sendEvent = async (name) => {
  await fetch(`https://graph.facebook.com/{API_VERSION}/${FB_PIXEL_ID}/events?access_token=${TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "data": [
        {
          "event_name": name,
          "event_time": Date.now(),
          "action_source": "website"
        }
      ]
    }),
  });
}