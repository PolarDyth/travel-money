/*
  Warnings:

  - You are about to drop the column `amountCounted` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `confirmationStepsCompleted` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `currencyCode` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddressLine1` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerDOB` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerFirstName` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerLastName` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `customerPostcode` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `foreinAmount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `primaryIdExpiryDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `primaryIdIssueDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `primaryIdNumber` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `primaryIdType` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `readBackDone` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryIdExpiryDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryIdIssueDate` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryIdNumber` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryIdType` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `sterlingAmount` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amountCounted",
DROP COLUMN "confirmationStepsCompleted",
DROP COLUMN "currencyCode",
DROP COLUMN "customerAddressLine1",
DROP COLUMN "customerDOB",
DROP COLUMN "customerFirstName",
DROP COLUMN "customerLastName",
DROP COLUMN "customerPostcode",
DROP COLUMN "exchangeRate",
DROP COLUMN "foreinAmount",
DROP COLUMN "notes",
DROP COLUMN "primaryIdExpiryDate",
DROP COLUMN "primaryIdIssueDate",
DROP COLUMN "primaryIdNumber",
DROP COLUMN "primaryIdType",
DROP COLUMN "readBackDone",
DROP COLUMN "secondaryIdExpiryDate",
DROP COLUMN "secondaryIdIssueDate",
DROP COLUMN "secondaryIdNumber",
DROP COLUMN "secondaryIdType",
DROP COLUMN "sterlingAmount",
ADD COLUMN     "cashTendered" DECIMAL(10,2),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstNameEnc" TEXT NOT NULL,
    "lastNameEnc" TEXT NOT NULL,
    "postcodeEnc" TEXT NOT NULL,
    "addressLine1Enc" TEXT NOT NULL,
    "cityEnc" TEXT NOT NULL,
    "countryEnc" TEXT NOT NULL,
    "emailEnc" TEXT,
    "phoneEnc" TEXT,
    "primaryIdTypeEnc" TEXT,
    "primaryIdNumberEnc" TEXT,
    "primaryIdIssueDateEnc" TEXT,
    "primaryIdExpiryDateEnc" TEXT,
    "customerDOBEnc" TEXT,
    "secondaryIdTypeEnc" TEXT,
    "secondaryIdNumberEnc" TEXT,
    "secondaryIdIssueDateEnc" TEXT,
    "secondaryIdExpiryDateEnc" TEXT,
    "proofOfFunds" BOOLEAN,
    "proofOfUse" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyDetail" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "sterlingAmount" DECIMAL(10,2) NOT NULL,
    "foreignAmount" DECIMAL(10,2) NOT NULL,
    "exchangeRate" DECIMAL(10,6) NOT NULL,
    "transactionType" TEXT NOT NULL,
    "operatorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyDetail" ADD CONSTRAINT "CurrencyDetail_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
