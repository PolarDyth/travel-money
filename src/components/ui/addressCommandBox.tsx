"use client";

import { useEffect, useState } from "react";
import { TransactionSchema } from "../transaction/schema";
import { useFormContext } from "react-hook-form";
import { parseAddressComponents } from "@/util/parseAddressComponents";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
import { FormControl, FormField } from "./form";

interface Suggestion {
  place_id: string;
  description: string;
}

export default function AddressCommandBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { setValue, control, register } = useFormContext<TransactionSchema>();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) return;

      setLoading(true);
      const res = await fetch(
        `/api/address/autocomplete?input=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
      setLoading(false);
    };

    const delay = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = async (placeId: string) => {
    console.log("Suggestion selected:", suggestions);
    console.log("Selected placeId:", placeId);
    const res = await fetch(`/api/address/details?placeId=${placeId}`);
    const data = await res.json();
    console.log("Place details:", data.details);
    const parsed = parseAddressComponents(data.details.address_components);
    console.log("Parsed address:", parsed);
    setValue("customerInfo.customerAddressLine1", parsed.streetAddress);
    setValue("customerInfo.customerPostcode", parsed.postcode);
    setValue("customerInfo.customerCity", parsed.city);
    setValue("customerInfo.customerCountry", parsed.country);

    // optionally clear the search bar
    setQuery(parsed.streetAddress || data.details.formatted_address || "");
  };

  return (
    <FormField
      control={control}
      {...register("customerInfo.customerAddressLine1")}
      name="customerInfo.customerAddressLine1"
      render={({ field }) => (
        <Command className="w-full border rounded-md shadow relative overflow-visible">
            <FormControl>
              <CommandInput
                placeholder="Search address..."
                {...field}
                value={query}
                onValueChange={(value) => {
                  setQuery(value);
                  setIsOpen(true);
                  field.onChange(value);
                }}
                onBlur={() => {
                  setTimeout(() => setIsOpen(false), 100);
                }}
                onFocus={() => setIsOpen(true)}
              />
            </FormControl>
            {isOpen && (
              <CommandList className="absolute z-50 w-full mt-9 bg-white border rounded-md shadow-md max-h-64">
                {loading && <CommandItem>Searching...</CommandItem>}
                {!loading &&
                  suggestions.map((s) => (
                    <CommandItem
                      key={s.place_id}
                      onSelect={() => {
                        handleSelect(s.place_id);
                      }}
                    >
                      {s.description}
                    </CommandItem>
                  ))}
              </CommandList>
            )}
        </Command>
      )}
    />
  );
}
