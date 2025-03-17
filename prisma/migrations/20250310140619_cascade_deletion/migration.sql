-- DropForeignKey
ALTER TABLE "CharacteristicAndAttribute" DROP CONSTRAINT "CharacteristicAndAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "CharacteristicAndAttribute" DROP CONSTRAINT "CharacteristicAndAttribute_characteristicId_fkey";

-- DropForeignKey
ALTER TABLE "CharacteristicAndSection" DROP CONSTRAINT "CharacteristicAndSection_characteristicId_fkey";

-- DropForeignKey
ALTER TABLE "CharacteristicAndSection" DROP CONSTRAINT "CharacteristicAndSection_sectionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RoomSection" DROP CONSTRAINT "RoomSection_roomSectionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RoomTypeAndSection" DROP CONSTRAINT "RoomTypeAndSection_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RoomTypeAndSection" DROP CONSTRAINT "RoomTypeAndSection_sectionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SectionAttributeValue" DROP CONSTRAINT "SectionAttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "SectionAttributeValue" DROP CONSTRAINT "SectionAttributeValue_characteristicId_fkey";

-- AddForeignKey
ALTER TABLE "CharacteristicAndAttribute" ADD CONSTRAINT "CharacteristicAndAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicAndAttribute" ADD CONSTRAINT "CharacteristicAndAttribute_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicAndSection" ADD CONSTRAINT "CharacteristicAndSection_sectionTypeId_fkey" FOREIGN KEY ("sectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicAndSection" ADD CONSTRAINT "CharacteristicAndSection_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSection" ADD CONSTRAINT "RoomSection_roomSectionTypeId_fkey" FOREIGN KEY ("roomSectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAndSection" ADD CONSTRAINT "RoomTypeAndSection_sectionTypeId_fkey" FOREIGN KEY ("sectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAndSection" ADD CONSTRAINT "RoomTypeAndSection_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_characteristicId_fkey" FOREIGN KEY ("characteristicId") REFERENCES "Characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
