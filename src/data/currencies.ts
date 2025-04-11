export const currencies = [
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 1.19,
    buy: 1.31,
    sell: 1.17,
    denominations: [500, 200, 100, 50, 20, 10, 5],
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: 1.27,
    buy: 1.45,
    sell: 1.24,
    denominations: [100, 50, 20, 10, 5, 2, 1],
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    rate: 189.45,
    buy: 194.1,
    sell: 184.8,
    denominations: [10000, 5000, 2000, 1000],
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: 1.92,
    buy: 1.97,
    sell: 1.87,
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    rate: 1.71,
    buy: 1.75,
    sell: 1.67,
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr.",
    rate: 1.14,
    buy: 1.17,
    sell: 1.11,
    denominations: [1000, 200, 100, 50, 20, 10],
  },
];

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  buy: number;
  sell: number;
  denominations: number[];
};
