-- AlterTable
ALTER TABLE "User" ALTER COLUMN "orders" SET DEFAULT ARRAY[]::JSONB[];
