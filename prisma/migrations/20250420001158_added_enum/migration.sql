/*
  Warnings:

  - Changed the type of `transactionType` on the `CurrencyDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "CurrencyDetail" DROP COLUMN "transactionType",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;
