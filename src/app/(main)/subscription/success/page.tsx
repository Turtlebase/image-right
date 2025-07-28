
"use client";

// This page is no longer used in the simplified payment flow.
// It can be safely deleted in a future cleanup.
// The user is now directed to Razorpay's hosted success page.

export default function DeprecatedSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <h1 className="text-2xl font-bold">Page Not Used</h1>
        <p className="text-muted-foreground mt-2">
            This success page is no longer part of the payment flow.
        </p>
    </div>
  );
}
