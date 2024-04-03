/*
  Warnings:

  - Added the required column `cart` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cart" JSONB NOT NULL,
ADD COLUMN     "orders" JSONB[];
