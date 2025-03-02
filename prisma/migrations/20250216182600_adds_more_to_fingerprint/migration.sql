/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `user_fingerprint` table. All the data in the column will be lost.
  - You are about to drop the column `npnOrProxy` on the `user_fingerprint` table. All the data in the column will be lost.
  - Made the column `botProbability` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `confidenceScore` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fraudScore` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `user_fingerprint` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "user_fingerprint_fingerprintId_key";

-- DropIndex
DROP INDEX "user_fingerprint_userId_key";

-- AlterTable
ALTER TABLE "user_fingerprint" DROP COLUMN "ipAddress",
DROP COLUMN "npnOrProxy",
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "vpnOrProxy" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "botProbability" SET NOT NULL,
ALTER COLUMN "botProbability" SET DEFAULT 0,
ALTER COLUMN "confidenceScore" SET NOT NULL,
ALTER COLUMN "confidenceScore" SET DEFAULT 0,
ALTER COLUMN "fraudScore" SET NOT NULL,
ALTER COLUMN "fraudScore" SET DEFAULT 0,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "user_fingerprint_userId_idx" ON "user_fingerprint"("userId");
