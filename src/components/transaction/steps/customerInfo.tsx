import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionSchema } from "../schema";
import { useFormContext } from "react-hook-form";
import CustomerDetails from "./customerInfo/customerDetails";
import { SelectSeparator } from "@/components/ui/select";
import CustomerPrimaryId from "./customerInfo/customerPrimaryId";
import CustomerSecondaryId from "./customerInfo/customerSecondaryId";
import { useEffect } from "react";

export default function CustomerInfo() {
  const { watch, setValue } =
    useFormContext<TransactionSchema>();

  const transactionValue = watch("allCurrencyDetails.totalSterling");
  
  useEffect(() => {
    setValue("customerInfo.sterlingAmount", transactionValue);
  }, [transactionValue, setValue]);


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            {transactionValue >= 5000
              ? "Enhanced due diligence required for transactions over £5000"
              : transactionValue >= 500
              ? "ID verification required for transactions between £500 and £5000."
              : "Basic customer information required for transactions under £500."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerDetails />
          {transactionValue >= 500 && (
            <>
              <SelectSeparator className="my-10" />
              <CustomerPrimaryId />
            </>
          )}
          {transactionValue >= 5000 && (
            <>
              <SelectSeparator className="my-10" />
              <CustomerSecondaryId />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
