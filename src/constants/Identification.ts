export const primaryIdType = [
  "PASSPORT",
  "DRIVERS_LICENSE",
  "NATIONAL_ID",
] as const;

export const secondaryIdType = [
  "DRIVERS_LICENSE",
  "UTILITY_BILL",
  "BANK_STATEMENT",
  "OTHER",
] as const;

export const sourceType = [
  "EMPLOYMENT",
  "SELF_EMPLOYMENT",
  "INVESTMENT",
  "INHERITANCE",
] as const;

export const useOfFundsType = [
  "TRAVEL",
  "PURCHASE",
  "SAVINGS",
] as const;