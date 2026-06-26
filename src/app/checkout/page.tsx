import { redirect } from "next/navigation";

// Boxit runs a quote-based model — no direct payment checkout.
// Anything that reaches /checkout is sent to the quote request.
export default function CheckoutPage() {
  redirect("/quote");
}
