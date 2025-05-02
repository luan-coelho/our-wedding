/*
  Warnings:

  - You are about to drop the column `email` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gift" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Guest" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "email",
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "updatedAt" DROP NOT NULL;
