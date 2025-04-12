import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../../schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-inpux";
import AddressCommandBox from "@/components/ui/addressCommandBox";

export default function CustomerDetails() {
  const { register, control } = useFormContext<TransactionSchema>();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        {...register("customerInfo.customerFirstName")}
        name="customerInfo.customerFirstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Customer First Name"
                className="input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerLastName")}
        name="customerInfo.customerLastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="Customer Last Name"
                className="input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerAddressLine1")}
        name="customerInfo.customerAddressLine1"
        render={() => (
          <FormItem>
            <FormLabel>Address Line 1 *</FormLabel>
            <FormControl>
              <AddressCommandBox />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerPostcode")}
        name="customerInfo.customerPostcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode *</FormLabel>
            <FormControl>
              <Input
                placeholder="Customer Postcode"
                className="input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerCity")}
        name="customerInfo.customerCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <FormControl>
              <Input placeholder="Customer City" className="input" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerCountry")}
        name="customerInfo.customerCountry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <FormControl>
              <Input
                placeholder="Customer Country"
                className="input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        {...register("customerInfo.customerEmail")}
        name="customerInfo.customerEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="Customer Email"
                className="input"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        {...register("customerInfo.customerPhone")}
        name="customerInfo.customerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <div className="h-fit">
                <PhoneInput
                  placeholder="Customer Phone"
                  className="input"
                  defaultCountry="GB"
                  {...field}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
