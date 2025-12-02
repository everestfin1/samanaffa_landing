import type { Metadata } from "next";
import APE from "../../components/APE/APE";

export const metadata: Metadata = {
  title: "EVEREST Finance | Apesenegal",
  icons: {
    icon: [
      { url: "/logo-everest.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-everest.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo-everest.png",
    apple: "/logo-everest.png",
  },
};

export default function APEPage() {
  return <APE />;
}

