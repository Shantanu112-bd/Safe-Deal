import { toast } from "sonner";

/**
 * Global notification helper for SafeDeal events
 */
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
  promise: (promise: Promise<any>, text: { loading: string; success: string; error: string }) => {
    toast.promise(promise, text);
  },
  // Specific Deal notifications
  dealCreated: (dealId: string) => {
    toast.success("Deal created successfully", {
      description: `Deal Reference: #${dealId}`
    });
  },
  paymentLocked: (amount: string) => {
    toast.success("Payment locked — safe to ship", {
      description: `${amount} USDC secured in escrow.`
    });
  },
  paymentReleased: () => {
    toast.success("Payment released to your wallet");
  },
  disputeRaised: () => {
    toast.error("Dispute raised — funds frozen", {
      description: "Our team will review the case shortly."
    });
  },
  refundProcessed: () => {
    toast.info("Auto-refund processed");
  }
};
