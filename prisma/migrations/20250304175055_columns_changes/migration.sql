/*
  Warnings:

  - You are about to drop the column `roomSectionTypeId` on the `AttributeType` table. All the data in the column will be lost.
  - You are about to drop the column `roomTypeId` on the `RoomSectionType` table. All the data in the column will be lost.
  - You are about to drop the `AttributeRelationship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fallbackName` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fallbackName` to the `AttributeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fallbackName` to the `RoomSectionType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fallbackName` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttributeRelationship" DROP CONSTRAINT "AttributeRelationship_childAtttributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeRelationship" DROP CONSTRAINT "AttributeRelationship_parentAttributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeType" DROP CONSTRAINT "AttributeType_roomSectionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RoomSectionType" DROP CONSTRAINT "RoomSectionType_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "en" TEXT,
ADD COLUMN     "fallbackName" TEXT NOT NULL,
ADD COLUMN     "ru" TEXT;

-- AlterTable
ALTER TABLE "AttributeType" DROP COLUMN "roomSectionTypeId",
ADD COLUMN     "en" TEXT,
ADD COLUMN     "fallbackName" TEXT NOT NULL,
ADD COLUMN     "ru" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomSectionType" DROP COLUMN "roomTypeId",
ADD COLUMN     "en" TEXT,
ADD COLUMN     "fallbackName" TEXT NOT NULL,
ADD COLUMN     "ru" TEXT;

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "en" TEXT,
ADD COLUMN     "fallbackName" TEXT NOT NULL,
ADD COLUMN     "ru" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL;

-- DropTable
DROP TABLE "AttributeRelationship";

-- CreateTable
CREATE TABLE "AttributeTypeAndSection" (
    "id" TEXT NOT NULL,
    "attributeTypeId" TEXT NOT NULL,
    "sectionTypeId" TEXT NOT NULL,

    CONSTRAINT "AttributeTypeAndSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "fallbackName" TEXT NOT NULL,
    "kz" TEXT,
    "en" TEXT,
    "ru" TEXT
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "fallbackName" TEXT NOT NULL,
    "kz" TEXT,
    "en" TEXT,
    "ru" TEXT,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTypeAndSection" (
    "id" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "sectionTypeId" TEXT NOT NULL,

    CONSTRAINT "RoomTypeAndSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_id_key" ON "City"("id");

-- AddForeignKey
ALTER TABLE "AttributeTypeAndSection" ADD CONSTRAINT "AttributeTypeAndSection_sectionTypeId_fkey" FOREIGN KEY ("sectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTypeAndSection" ADD CONSTRAINT "AttributeTypeAndSection_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "AttributeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAndSection" ADD CONSTRAINT "RoomTypeAndSection_sectionTypeId_fkey" FOREIGN KEY ("sectionTypeId") REFERENCES "RoomSectionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAndSection" ADD CONSTRAINT "RoomTypeAndSection_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
