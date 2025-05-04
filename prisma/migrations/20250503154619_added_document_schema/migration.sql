-- AlterTable
ALTER TABLE "Rent" ADD COLUMN     "paymentDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "xml" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rentId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_rentId_key" ON "Document"("rentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
