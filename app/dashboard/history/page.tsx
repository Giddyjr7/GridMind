import { redirect } from "next/navigation";

export default function HistoryRedirectPage() {
  redirect("/dashboard/decisions?tab=history");
}
