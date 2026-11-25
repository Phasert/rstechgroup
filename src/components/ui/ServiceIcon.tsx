import { Activity, MapPin, MonitorSmartphone, Network, Share2, Wrench, type LucideProps } from "lucide-react";
import type { Service } from "@/lib/services";

const map = { Wrench, Network, MonitorSmartphone, Share2, MapPin, Activity };

export function ServiceIcon({ name, ...props }: { name: Service["icon"] } & LucideProps) {
  const Icon = map[name];
  return <Icon aria-hidden {...props} />;
}
