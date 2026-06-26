// Payment methods. COD + manual bank transfer work with no gateway.
// JazzCash/Easypaisa/cards are scaffolded behind an adapter so they switch on
// once a merchant account (PayFast PK / Safepay) and keys are configured.

export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash_easypaisa";

export const paymentMethods: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives.",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer to our account and share the receipt on WhatsApp.",
  },
  {
    id: "jazzcash_easypaisa",
    label: "JazzCash / Easypaisa",
    description: "Pay via mobile wallet and share the receipt on WhatsApp.",
  },
];

// Placeholder payee details — replace with real ones before launch.
export const payeeDetails = {
  bankName: "Meezan Bank",
  accountTitle: "Boxit Pakistan",
  accountNumber: "PK00MEZN0000000000000000",
  jazzcash: "0332-3333654",
  easypaisa: "0332-3333654",
};

export type PaymentInstruction = {
  method: PaymentMethod;
  status: "pending_cod" | "awaiting_transfer" | "redirect";
  // For gateway methods once enabled:
  redirectUrl?: string;
  // Human-readable instructions for manual methods:
  instructions?: string;
};

/**
 * Returns what the client should do next for a given method.
 * When PAYMENT_PROVIDER is set to a real gateway, wallet/card payments would
 * return a redirectUrl instead of manual instructions.
 */
export function getPaymentInstruction(
  method: PaymentMethod,
  orderId: string,
  total: number,
): PaymentInstruction {
  const provider = process.env.PAYMENT_PROVIDER ?? "manual";

  if (method === "cod") {
    return {
      method,
      status: "pending_cod",
      instructions: `Pay PKR ${total.toLocaleString("en-PK")} in cash on delivery.`,
    };
  }

  if (method === "jazzcash_easypaisa" && provider !== "manual") {
    // TODO: create a real gateway session (PayFast/Safepay) and return its URL.
    return { method, status: "redirect", redirectUrl: `/order/${orderId}` };
  }

  if (method === "bank_transfer") {
    return {
      method,
      status: "awaiting_transfer",
      instructions: `Transfer PKR ${total.toLocaleString("en-PK")} to ${payeeDetails.accountTitle}, ${payeeDetails.bankName}, A/C ${payeeDetails.accountNumber}. Then send the receipt on WhatsApp with order ${orderId}.`,
    };
  }

  // jazzcash_easypaisa in manual mode
  return {
    method,
    status: "awaiting_transfer",
    instructions: `Send PKR ${total.toLocaleString("en-PK")} to JazzCash/Easypaisa ${payeeDetails.jazzcash}. Then share the receipt on WhatsApp with order ${orderId}.`,
  };
}
