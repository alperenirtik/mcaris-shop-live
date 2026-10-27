import { getDealOfTheDaySettings } from "@/lib/settings";
import DealOfTheDayClient from "./DealOfTheDayClient";

export default async function DealOfTheDay() {
  const dealSettings = await getDealOfTheDaySettings();

  if (!dealSettings.isActive) {
    return null;
  }

  return <DealOfTheDayClient settings={dealSettings} />;
}



