/*
  Warnings:

  - Added the required column `buyRate` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellRate` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExchangeRate" ADD COLUMN     "buyRate" DECIMAL(18,8) NOT NULL,
ADD COLUMN     "sellRate" DECIMAL(18,8) NOT NULL;
