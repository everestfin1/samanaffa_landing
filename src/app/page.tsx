import type { Metadata } from "next";
import E0Landing from "@/components/landing/E0Landing";

export const metadata: Metadata = {
  title: "Sama Naffa | Ton épargne, notre expertise",
  description:
    "Sama Naffa accompagne ton épargne pas à pas avec Everest Finance, société agréée et régulée par l'AMF-UMOA.",
};

export default function Home() {
  return <E0Landing />;
}
