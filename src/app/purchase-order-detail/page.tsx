import Link from "next/link";

export default function PurchaseOrderDetailPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      This is the Purchase Order Detail Page
      <Link href="/" className="block underline">
        Go back home
      </Link>
    </div>
  );
}
