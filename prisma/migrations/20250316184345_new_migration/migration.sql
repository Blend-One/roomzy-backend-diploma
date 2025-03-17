/*
  Warnings:

  - Added the required column `building` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "building" DOUBLE PRECISION NOT NULL;
