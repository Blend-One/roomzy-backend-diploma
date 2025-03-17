-- DropForeignKey
ALTER TABLE "RoomImage" DROP CONSTRAINT "RoomImage_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomSection" DROP CONSTRAINT "RoomSection_roomId_fkey";

-- DropForeignKey
ALTER TABLE "SectionAttributeValue" DROP CONSTRAINT "SectionAttributeValue_roomSectionId_fkey";

-- AddForeignKey
ALTER TABLE "RoomImage" ADD CONSTRAINT "RoomImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomSection" ADD CONSTRAINT "RoomSection_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_roomSectionId_fkey" FOREIGN KEY ("roomSectionId") REFERENCES "RoomSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionAttributeValue" ADD CONSTRAINT "SectionAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
