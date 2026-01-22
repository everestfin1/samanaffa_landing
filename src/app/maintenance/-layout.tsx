import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance en cours — Sama Naffa",
  description: "Sama Naffa est actuellement en maintenance. Nous reviendrons bientôt.",
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

