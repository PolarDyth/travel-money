import TransactionSuccessPage from "@/components/transaction/success/transactionSuccess";
import TransactionSuccessSkeleton from "@/components/ui/skeletons/dashboard/transactionSuccessSkeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: transactionId } = await searchParams;

  if (!transactionId) {
    notFound();
  }

  return (
    <Suspense fallback={<TransactionSuccessSkeleton />}>
      <TransactionSuccessPage transactionId={transactionId} />
    </Suspense>
  )
}