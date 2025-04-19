import { fetchDailyRates } from "@/lib/rates/fetchDailyRates";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetchDailyRates();
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Fetch-rates error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch rates" }, { status: 500 })
  }
}
