export const trackEventFunction = (event) => {
  if (process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true") {
      if (window.umami) {
          umami.track(event);
      }
    }
}