/*
  Warnings:

  - Added the required column `color` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_userId_productId_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
