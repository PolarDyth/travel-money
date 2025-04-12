import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import EN from "react-phone-number-input/locale/en";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> &
	Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
		onChange?: (value: RPNInput.Value) => void;
	};

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.memo(
	React.forwardRef<React.ComponentRef<typeof RPNInput.default>, PhoneInputProps>(
		({ className, onChange, ...props }, ref) => {
			return (
				<RPNInput.default
					ref={ref}
					className={cn("flex w-full flex-1", className)}
					flagComponent={FlagComponent}
					countrySelectComponent={CountrySelect}
					inputComponent={InputComponent}
					smartCaret={false}
					defaultCountry="BR"
					labels={EN}
					focusInputOnCountrySelection
					/**
					 * Handles the onChange event.
					 *
					 * react-phone-number-input might trigger the onChange event as undefined
					 * when a valid phone number is not entered. To prevent this,
					 * the value is coerced to an empty string.
					 *
					 * @param {E164Number | undefined} value - The entered value
					 */
					onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
					{...props}
				/>
			);
		},
	),
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, ...props }, ref) => (
		<Input className={cn("rounded-e-md rounded-s-none w-full flex-1", className)} {...props} ref={ref} />
	),
);
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
	disabled?: boolean;
	value: RPNInput.Country;
	options: CountryEntry[];
	onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = React.memo(
	({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) => {
		const [filteredCountries, setFilteredCountries] = React.useState<CountryEntry[]>(countryList || []);
		const [open, setOpen] = React.useState(false);
		const [parentNode, setParentNode] = React.useState<HTMLDivElement | null>(null);

		const refCallback = React.useCallback((node: HTMLDivElement) => {
			if (node) {
				setParentNode(node);
			}
		}, []);

		const virtualizer = useVirtualizer({
			count: filteredCountries.length,
			getScrollElement: () => parentNode,
			estimateSize: () => 35,
			overscan: 5,
		});

		const handleSearch = (search: string) => {
			if (!search.trim()) {
				setFilteredCountries(countryList);
			} else {
				setFilteredCountries(
					countryList.filter((country) =>
						country.label.toLowerCase().includes(search.toLowerCase()),
					),
				);
			}
		};

		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						role="combobox"
						variant="outline"
						aria-expanded={open}
						className="flex gap-1 rounded-md py-0 rounded-e-none border-r-0 px-3 focus:z-10"
					>
						<FlagComponent
							country={selectedCountry}
							countryName={countryList.find((c) => c.value === selectedCountry)?.label || ""}
						/>
						<ChevronsUpDown
							className={cn("-mr-2 size-4 opacity-50", disabled ? "hidden" : "opacity-100")}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0">
					<Command shouldFilter={false}>
						<CommandInput placeholder="Search country..." onValueChange={handleSearch} />

						<ScrollArea className="h-[400px] overflow-auto">
							<CommandEmpty>No countries found</CommandEmpty>
							<CommandGroup ref={refCallback}>
								<div
									style={{
										height: `${virtualizer.getTotalSize()}px`,
										width: "100%",
										position: "relative",
									}}
								>
									{virtualizer.getVirtualItems().map(({ index, size, start }) => {
										const country = filteredCountries[index];
										if (!country?.value) return null;
										return (
											<CommandItem
												key={country.value}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: `${size}px`,
													transform: `translateY(${start}px)`,
												}}
												onSelect={() => onChange(country.value!)}
												value={country.value}
											>
												<FlagComponent
													country={country.value!}
													countryName={country.label}
												/>
												<span className="flex-1 text-sm">{country.label}</span>
												<span className="text-foreground/50 text-sm">{`+${RPNInput.getCountryCallingCode(
													country.value!,
												)}`}</span>
												<CheckIcon
													className={`ml-auto size-4 ${
														country.value === selectedCountry
															? "opacity-100"
															: "opacity-0"
													}`}
												/>
											</CommandItem>
										);
									})}
								</div>
							</CommandGroup>
						</ScrollArea>
					</Command>
				</PopoverContent>
			</Popover>
		);
	},
);
CountrySelect.displayName = "CountrySelect";

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex size-6 overflow-hidden rounded-sm items-center justify-center">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};

export { PhoneInput };