export function parseAddressComponents(components: google.maps.GeocoderAddressComponent[]) {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  return {
    streetAddress: [get("street_number"), get("route")].filter(Boolean).join(" "),
    city: get("postal_town") || get("locality"),
    postcode: get("postal_code"),
    country: get("country"),
    county: get("administrative_area_level_2"),
  };
}
