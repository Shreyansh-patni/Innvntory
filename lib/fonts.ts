import localFont from "next/font/local";

export const fontPrimary = localFont({
  src: [
    { path: "../public/fonts/NewBlack/NewBlackTypeface-UltraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/NewBlack/NewBlackTypeface-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-newblack",
  display: "swap",
});

export const fontSecondary = localFont({
  src: [
    { path: "../public/fonts/LT-amber/LT Amber Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/LT-amber/LT Amber Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/LT-amber/LT Amber Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/LT-amber/LT Amber Demibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/LT-amber/LT Amber Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-lt-amber",
  display: "swap",
});
