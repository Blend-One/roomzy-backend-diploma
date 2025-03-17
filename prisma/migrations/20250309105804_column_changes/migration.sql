/*
  Warnings:

  - Added the required column `type` to the `Characteristic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `SectionAttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Characteristic" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SectionAttributeValue" ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "attributeId" DROP NOT NULL;
