import type { Metadata } from "next";
import { PrivacyDocument } from "@/components/PrivacyDocument";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos recoge el brief, para qué se usan y cómo pedir su supresión.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return <PrivacyDocument />;
}
