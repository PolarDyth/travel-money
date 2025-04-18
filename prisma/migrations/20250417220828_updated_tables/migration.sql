/*
  Warnings:

  - You are about to drop the column `operatorId` on the `CurrencyDetail` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfFunds` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfUse` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `transactionDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CurrencyDetail" DROP COLUMN "operatorId";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "proofOfFunds",
DROP COLUMN "proofOfUse";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionDate",
DROP COLUMN "transactionType";
