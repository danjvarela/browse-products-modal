import localFont from "next/font/local";

export const segoeUI = localFont({
  src: [
    {
      path: "./Segoe UI.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Segoe UI Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Segoe UI Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Segoe UI Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-segoe-ui",
});
