import { redirect } from "next/navigation";

export default function EquipmentRedirectPage() {
  redirect("/dashboard/devices?tab=loads");
}
