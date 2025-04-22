import CurrencyDetailPage from "@/components/rates/currency/fullCurrencyPage";
import { Suspense } from "react";

export default async function CurrencyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense>
      <CurrencyDetailPage code={slug} />
    </Suspense>
  )
}