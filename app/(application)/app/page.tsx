import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/onboarding/service";

export default async function AppRootPage() {
  const status = await getOnboardingStatus();
  if (!status.isCompleted) {
    redirect("/app/onboarding");
  }
  redirect("/app/dashboard");
}
