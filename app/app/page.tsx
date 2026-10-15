import type { Metadata } from "next";
import { Workspace } from "@/components/osd/Workspace";

export const metadata: Metadata = {
  title: "Escenario sólidos orales",
  robots: { index: false, follow: false },
};

export default function ScenarioAppPage({ searchParams }: { searchParams?: { token?: string } }) {
  return <Workspace initialToken={searchParams?.token ?? ""} />;
}
