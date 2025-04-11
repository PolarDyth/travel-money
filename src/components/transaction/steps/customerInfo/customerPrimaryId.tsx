import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../../schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { primaryIdType, sourceType, useOfFundsType } from "@/constants/Identification";

export default function CustomerPrimaryId() {
  const { register, control } = useFormContext<TransactionSchema>();
  return (
    <>
      <h3 className="text-lg font-medium">ID Verification</h3>
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-3">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.customerDOB")}
            name="customerInfo.primaryId.customerDOB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[0]
                        : ''
                    }
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : '';
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-3">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.type")}
            name="customerInfo.primaryId.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary ID *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger id="primaryId" className="w-full">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {primaryIdType.map((idType) => (
                      <SelectItem key={idType} value={idType}>
                        {idType
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.number")}
            name="customerInfo.primaryId.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number *</FormLabel>
                <FormControl>
                  <Input placeholder="ID Number" className="input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.issueDate")}
            name="customerInfo.primaryId.issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[0]
                        : ''
                    }
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : '';
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.expiryDate")}
            name="customerInfo.primaryId.expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? field.value.toISOString().split("T")[0]
                        : ''
                    }
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : '';
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-3">
          <FormField
            control={control}
            {...register("customerInfo.primaryId.sourceOfFunds")}
            name="customerInfo.primaryId.sourceOfFunds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source of Funds</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger id="sourceOfFunds" className="w-full">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sourceType.map((idType) => (
                      <SelectItem key={idType} value={idType}>
                        {idType
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-3">
          <FormField
          control={control}
          {...register("customerInfo.primaryId.useOfFunds")}
          name="customerInfo.primaryId.useOfFunds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use of Funds</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger id="useOfFunds" className="w-full">
                    <SelectValue placeholder="Select ID Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {useOfFundsType.map((idType) => (
                    <SelectItem key={idType} value={idType}>
                      {idType
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        </div>
      </div>
    </>
  );
}
