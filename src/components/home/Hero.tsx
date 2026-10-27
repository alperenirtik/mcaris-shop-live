import { getHeroSettings } from "@/lib/settings";
import HeroClient from "./HeroClient";

export default async function Hero() {
  const heroSettings = await getHeroSettings();
  return <HeroClient settings={heroSettings} />;
}
