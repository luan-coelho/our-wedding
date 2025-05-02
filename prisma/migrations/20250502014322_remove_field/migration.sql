/*
  Warnings:

  - You are about to drop the column `companions` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Guest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "companions",
DROP COLUMN "email";
