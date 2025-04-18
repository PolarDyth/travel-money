import { Currency } from "@/data/currencies";
import { SWRResponse } from "swr";

export interface SWRCurrency {
  currenciesSWR: SWRResponse<Currency[], Error>;
}