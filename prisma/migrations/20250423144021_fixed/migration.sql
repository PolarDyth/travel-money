/*
  Warnings:

  - You are about to drop the column `orderId` on the `CurrencyDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CurrencyDetail" DROP CONSTRAINT "CurrencyDetail_orderId_fkey";

-- AlterTable
ALTER TABLE "CurrencyDetail" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "currencyCode" CHAR(3) NOT NULL,
    "sterlingAmount" DECIMAL(10,2) NOT NULL,
    "foreignAmount" DECIMAL(10,2) NOT NULL,
    "exchangeRate" DECIMAL(10,6) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "CurrencyDetail_transactionId_idx" ON "CurrencyDetail"("transactionId");

-- CreateIndex
CREATE INDEX "CurrencyDetail_currencyCode_idx" ON "CurrencyDetail"("currencyCode");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_operatorId_idx" ON "Order"("operatorId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Transaction_operatorId_idx" ON "Transaction"("operatorId");

-- CreateIndex
CREATE INDEX "Transaction_customerId_idx" ON "Transaction"("customerId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_branch_idx" ON "User"("branch");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
