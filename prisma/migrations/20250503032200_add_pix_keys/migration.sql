-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "pixKeyId" INTEGER;

-- CreateTable
CREATE TABLE "PixKey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PixKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PixKey_key_key" ON "PixKey"("key");

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_pixKeyId_fkey" FOREIGN KEY ("pixKeyId") REFERENCES "PixKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
