"use client";

import {
  ArrowDownUp,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Prisma } from "../../../generated/prisma";
import React from "react";

type TransactionWithCurrencyAndRate = Prisma.TransactionGetPayload<{
  include: {
    operator: { select: { firstName: true; lastName: true } };
    currencyDetails: { include: { currency: { select: { symbol: true } } } };
  };
}>;

interface TransactionsProps {
  transactions: TransactionWithCurrencyAndRate[];
}

export function RecentTransactions({ transactions }: TransactionsProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">No transactions available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="hidden md:table-cell">Operator</TableHead>
            <TableHead className="hidden lg:table-cell">Time</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <TableRow
                className={expandedRows[transaction.id] ? "border-b-0" : ""}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleRow(transaction.id.toString())}
                    aria-label={
                      expandedRows[transaction.id]
                        ? "Collapse transaction details"
                        : "Expand transaction details"
                    }
                  >
                    {expandedRows[transaction.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {transaction.operator.firstName}{" "}
                  {transaction.operator.lastName}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {new Date(transaction.createdAt)
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, 16)
                    .replace(/-/g, "/")}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {transaction.totalSterling?.toString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {Object.entries(JSON.parse(transaction.paymentMethod))
                      .filter(([, amount]) => Number(amount) != 0)
                      .map(([method, amount]) => (
                        <Badge
                          key={method + String(amount)}
                          variant="outline"
                          className="ml-1"
                        >
                          {method === "CARD" ? (
                            <CreditCard className="mr-1 h-3 w-3" />
                          ) : (
                            <Banknote className="mr-1 h-3 w-3" />
                          )}
                          {Number(amount).toFixed(2)}
                        </Badge>
                      ))}
                  </div>
                </TableCell>
              </TableRow>

              {/* Expanded details row */}
              {expandedRows[transaction.id] && (
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={6} className="p-4">
                    <div className="space-y-4">
                      {/* Currency exchanges */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium">
                          Currency Exchanges
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {transaction.currencyDetails.map((currency) => (
                            <div
                              key={currency.id}
                              className="rounded-md border bg-background p-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {currency.currencyCode}
                                </span>
                                <Badge
                                  variant={
                                    currency.transactionType === "SELL"
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {currency.transactionType === "SELL" ? (
                                    <ArrowRightLeft className="mr-1 h-3 w-3" />
                                  ) : (
                                    <ArrowDownUp className="mr-1 h-3 w-3" />
                                  )}
                                  {currency.transactionType === "SELL"
                                    ? "Sell"
                                    : "Buy"}
                                </Badge>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-1 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Amount
                                  </p>
                                  <p>
                                    {currency.currency.symbol}{" "}
                                    {Number(currency.foreignAmount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    GBP Value
                                  </p>
                                  <p>{Number(currency.sterlingAmount)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Rate</p>
                                  <p>
                                    1 GBP ={" "}
                                    {Number(currency.exchangeRate).toFixed(2)}{" "}
                                    {currency.currencyCode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment details */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium">
                          Payment Details
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Object.entries(
                            JSON.parse(transaction.paymentMethod)
                          ).map(([method, payment]) => {
                            const paymentNumber = Number(payment).toFixed(2);
                            if (payment != 0) {
                              return (
                                <div
                                  key={method + String(paymentNumber)}
                                  className="rounded-md border bg-background p-3"
                                >
                                  <div className="flex items-center">
                                    {method === "CARD" ? (
                                      <CreditCard className="mr-2 h-4 w-4" />
                                    ) : (
                                      <Banknote className="mr-2 h-4 w-4" />
                                    )}
                                    <span className="font-medium">
                                      {method}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Amount:
                                      </span>
                                      <span>{paymentNumber}</span>
                                    </div>
                                    <div className="text-muted-foreground">
                                      {Number(transaction.cashTendered) > 0 &&
                                        method == "CASH" && (
                                          <>
                                            {transaction.cashTendered} tendered,
                                            {Number(transaction.cashTendered) >
                                              0 && (
                                              <>
                                                <span>
                                                  {" "}
                                                  Change:{" "}
                                                  {Number(
                                                    transaction.totalSterling
                                                  ) - Number(payment)}
                                                </span>
                                              </>
                                            )}
                                          </>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
