/*
  Warnings:

  - You are about to alter the column `currencyCode` on the `CurrencyDetail` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(3)`.

*/
-- AlterTable
ALTER TABLE "CurrencyDetail" ALTER COLUMN "currencyCode" SET DATA TYPE CHAR(3);

-- AddForeignKey
ALTER TABLE "CurrencyDetail" ADD CONSTRAINT "CurrencyDetail_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
