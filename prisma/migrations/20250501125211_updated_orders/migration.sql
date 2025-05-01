-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "collectedAt" TIMESTAMP(3),
ADD COLUMN     "collectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "OperatorMessage" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OperatorMessage_userId_idx" ON "OperatorMessage"("userId");

-- AddForeignKey
ALTER TABLE "OperatorMessage" ADD CONSTRAINT "OperatorMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
