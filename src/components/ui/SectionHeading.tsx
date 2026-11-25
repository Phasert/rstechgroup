import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <RevealItem><p className={cn("eyebrow", dark && "text-blue-300")}>{eyebrow}</p></RevealItem>
      <RevealItem><h2 className={cn("display-2 mt-4", dark && "text-white")}>{title}</h2></RevealItem>
      {lead && (
        <RevealItem><p className={cn("lead mt-5", dark && "text-white/70")}>{lead}</p></RevealItem>
      )}
    </Reveal>
  );
}
