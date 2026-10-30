import { redirect } from "next/navigation";

export default function SourcesRedirectPage() {
  redirect("/dashboard/devices?tab=sources");
}
