/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `user_fingerprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "scan" ADD COLUMN     "ips" TEXT[];

-- AlterTable
ALTER TABLE "user_fingerprint" DROP COLUMN "ipAddress",
ADD COLUMN     "ips" TEXT;
