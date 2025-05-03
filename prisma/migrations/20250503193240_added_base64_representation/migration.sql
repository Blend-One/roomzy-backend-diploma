/*
  Warnings:

  - Added the required column `base64Xml` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "base64Xml" TEXT NOT NULL,
ADD COLUMN     "landlordCommonName" TEXT,
ADD COLUMN     "landlordIIN" TEXT,
ADD COLUMN     "renterCommonName" TEXT,
ADD COLUMN     "renterIIN" TEXT;
