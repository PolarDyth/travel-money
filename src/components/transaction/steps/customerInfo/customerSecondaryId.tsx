import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../../schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { secondaryIdType } from "@/constants/Identification";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CustomerSecondaryId() {
  const { register, control } = useFormContext<TransactionSchema>();

  return (
    <>
      <h3 className="text-lg font-medium">ID Verification</h3>
      <div className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-6">
          <FormField
            control={control}
            {...register("customerInfo.secondaryId.secondaryType")}
            name="customerInfo.secondaryId.secondaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary ID *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger id="secondaryId" className="w-full">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secondaryIdType.map((idType) => (
                      <SelectItem key={idType} value={idType}>
                        {idType
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            control={control}
            {...register("customerInfo.secondaryId.secondaryNumber")}
            name="customerInfo.secondaryId.secondaryNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID/Reference Number *</FormLabel>
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
            {...register("customerInfo.secondaryId.secondaryIssueDate")}
            name="customerInfo.secondaryId.secondaryIssueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : "";
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
            {...register("customerInfo.secondaryId.secondaryExpiryDate")}
            name="customerInfo.secondaryId.secondaryExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const newDate = e.target.value
                        ? new Date(e.target.value)
                        : "";
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-6">
          <FormField
            control={control}
            {...register("customerInfo.secondaryId.proofOfFunds")}
            name="customerInfo.secondaryId.proofOfFunds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Funds</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      id="proofOfFunds"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="proofOfFunds" className="text-sm">
                      I have received proof of funds from the customer and
                      photocopied it.
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
          control={control}
          {...register("customerInfo.secondaryId.proofOfUse")}
          name="customerInfo.secondaryId.proofOfUse"
          render={({ field
            }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      id="proofOfUse"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="proofOfUse" className="text-sm">
                      I have received proof of use from the customer and
                      photocopied it.
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
