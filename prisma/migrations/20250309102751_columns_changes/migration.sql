/*
  Warnings:

  - You are about to drop the column `typeName` on the `RoomSectionType` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RoomType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fallbackName]` on the table `RoomSectionType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fallbackName]` on the table `RoomType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RoomType_name_key";

-- AlterTable
ALTER TABLE "RoomSectionType" DROP COLUMN "typeName";

-- AlterTable
ALTER TABLE "RoomType" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "RoomSectionType_fallbackName_key" ON "RoomSectionType"("fallbackName");

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_fallbackName_key" ON "RoomType"("fallbackName");
