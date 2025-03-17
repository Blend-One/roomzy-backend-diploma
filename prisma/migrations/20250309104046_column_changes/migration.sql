/*
  Warnings:

  - You are about to drop the column `attributeTypeId` on the `SectionAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the `AttributeType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeTypeAndSection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `characteristicId` to the `SectionAttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttributeTypeAndSection" DROP CONSTRAINT "AttributeTypeAndSection_attributeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeTypeAndSection" DROP CONSTRAINT "AttributeTypeAndSection_sectionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SectionAttributeValue" DROP CONSTRAINT "SectionAttributeValue_attributeTypeId_fkey";

-- AlterTable
ALTER TABLE "SectionAttributeValue" DROP COLUMN "attributeTypeId",
ADD COLUMN     "characteristicId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AttributeType";

-- DropTable
DROP TABLE "AttributeTypeAndSection";

-- CreateTable
CREATE TABLE "CharacteristicAndSection" (
    "id" TEXT NOT NULL,
    "characteristicId" TEXT NOT NULL,
    "sectionTypeId" TEXT NOT NULL,

    CONSTRAINT "CharacteristicAndSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characteristic" (
    "id" TEXT NOT NULL,
    "fallbackName" TEXT NOT NULL,
    "ru" TEXT,
    "kz" TEXT,

    CONSTRAINT "Characteristic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacteristicAndSection" ADD CONSTRAINT "CharacteristicAndSection_sectionTypeId_fkey" FOREIGN KEY ("sectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicAndSection" ADD CONSTRAINT "CharacteristicAndSection_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
