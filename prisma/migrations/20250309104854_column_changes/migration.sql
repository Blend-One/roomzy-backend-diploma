/*
  Warnings:

  - You are about to drop the column `attributeTypeId` on the `Attribute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "attributeTypeId";

-- CreateTable
CREATE TABLE "CharacteristicAndAttribute" (
    "id" TEXT NOT NULL,
    "characteristicId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "CharacteristicAndAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharacteristicAndAttribute" ADD CONSTRAINT "CharacteristicAndAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicAndAttribute" ADD CONSTRAINT "CharacteristicAndAttribute_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
